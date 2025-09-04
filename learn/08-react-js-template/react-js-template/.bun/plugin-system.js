// 플러그인 시스템 구현
export class PluginSystem {
  constructor() {
    this.plugins = []
    this.hooks = {
      // 빌드 시작 전 호출
      buildStart: [],
      // 빌드 완료 후 호출
      buildEnd: [],
      // 파일 로드 시 호출
      load: [],
      // 파일 변환 시 호출
      transform: [],
      // 파일 해석 시 호출
      resolve: [],
      // 파일 출력 시 호출
      write: []
    }
  }

  // 플러그인 등록
  use(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      throw new Error('플러그인은 객체여야 합니다')
    }

    this.plugins.push(plugin)

    // 플러그인 훅 등록
    for (const [hookName, hookFns] of Object.entries(this.hooks)) {
      if (typeof plugin[hookName] === 'function') {
        hookFns.push(plugin[hookName].bind(plugin))
      }
    }

    return this
  }

  // 훅 실행 (직렬)
  async runHook(name, ...args) {
    const hooks = this.hooks[name] || []
    let result = args[0]

    for (const hook of hooks) {
      const hookResult = await hook(result, ...args.slice(1))
      if (hookResult !== undefined) {
        result = hookResult
      }
    }

    return result
  }

  // 훅 실행 (병렬)
  async runHookParallel(name, ...args) {
    const hooks = this.hooks[name] || []
    const results = await Promise.all(
      hooks.map(hook => hook(...args))
    )
    return results.filter(result => result !== undefined)
  }

  // 빌드 설정에 플러그인 적용
  async applyToBuildConfig(config) {
    // buildStart 훅 실행
    await this.runHookParallel('buildStart', config)

    // 플러그인 설정 적용
    const plugins = this.plugins
      .filter(plugin => plugin.name && typeof plugin.setup === 'function')
      .map(plugin => ({
        name: plugin.name,
        setup: plugin.setup
      }))

    return {
      ...config,
      plugins: [...(config.plugins || []), ...plugins]
    }
  }
}

// 기본 플러그인 생성 함수
export function createPlugin(options) {
  return {
    name: options.name || 'anonymous-plugin',
    ...options
  }
}

// 내장 플러그인들
export const builtinPlugins = {
  // CSS 플러그인
  css: () => createPlugin({
    name: 'css-plugin',
    setup(build) {
      // CSS 파일 처리
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        try {
          const cssFile = Bun.file(args.path)
          let cssContent = await cssFile.text()
          
          // CSS 모듈 처리
          if (args.path.endsWith('.module.css')) {
            const hash = args.path.split('/').pop().replace(/[^a-zA-Z0-9]/g, '_')
            
            // 클래스 이름 추출
            const classNames = {}
            const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g
            let match
            
            while ((match = classRegex.exec(cssContent)) !== null) {
              const className = match[1]
              classNames[className] = `${className}_${hash}`
            }
            
            // 클래스 이름 변환
            const cssModuleContent = cssContent.replace(
              /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g,
              (match, className) => `.${className}_${hash}`
            )
            
            // CSS를 head에 삽입하는 JS 코드 생성
            const jsContent = `
              const style = document.createElement('style');
              style.setAttribute('data-source', '${args.path}');
              style.textContent = ${JSON.stringify(cssModuleContent)};
              document.head.appendChild(style);
              export default ${JSON.stringify(classNames)};
            `
            
            return { contents: jsContent, loader: 'js' }
          }
          
          // 일반 CSS 파일 처리
          const jsContent = `
            const style = document.createElement('style');
            style.setAttribute('data-source', '${args.path}');
            style.textContent = ${JSON.stringify(cssContent)};
            document.head.appendChild(style);
            export default {};
          `
          
          return { contents: jsContent, loader: 'js' }
        } catch (error) {
          return { 
            contents: `
              console.error("CSS 처리 오류:", ${JSON.stringify(error.message)});
              export default {};
            `,
            loader: 'js'
          }
        }
      })
    }
  }),

  // JSON 플러그인
  json: () => createPlugin({
    name: 'json-plugin',
    setup(build) {
      build.onLoad({ filter: /\.json$/ }, async (args) => {
        try {
          const file = Bun.file(args.path)
          const content = await file.text()
          const parsed = JSON.parse(content)
          
          return {
            contents: `export default ${JSON.stringify(parsed)}`,
            loader: 'js'
          }
        } catch (error) {
          return {
            contents: `
              console.error("JSON 파싱 오류:", ${JSON.stringify(error.message)});
              export default {};
            `,
            loader: 'js'
          }
        }
      })
    }
  }),

  // 이미지 플러그인
  image: () => createPlugin({
    name: 'image-plugin',
    setup(build) {
      build.onLoad({ filter: /\.(png|jpe?g|gif|svg|webp)$/ }, async (args) => {
        // 개발 모드에서는 URL을 그대로 반환
        if (process.env.NODE_ENV === 'development') {
          const path = args.path.replace(process.cwd(), '')
          return {
            contents: `export default "${path}"`,
            loader: 'js'
          }
        }
        
        // 프로덕션 모드에서는 파일을 복사하고 해시된 경로 반환
        try {
          const file = Bun.file(args.path)
          const buffer = await file.arrayBuffer()
          const hash = createHash('md5').update(Buffer.from(buffer)).digest('hex').substring(0, 8)
          
          const fileName = args.path.split('/').pop()
          const ext = fileName.substring(fileName.lastIndexOf('.'))
          const baseName = fileName.substring(0, fileName.lastIndexOf('.'))
          
          const outputPath = `assets/${baseName}-${hash}${ext}`
          
          // 실제 파일 복사는 빌드 프로세스에서 처리
          
          return {
            contents: `export default "/${outputPath}"`,
            loader: 'js'
          }
        } catch (error) {
          return {
            contents: `
              console.error("이미지 처리 오류:", ${JSON.stringify(error.message)});
              export default "";
            `,
            loader: 'js'
          }
        }
      })
    }
  }),

  // YAML 플러그인
  yaml: () => createPlugin({
    name: 'yaml-plugin',
    setup(build) {
      build.onLoad({ filter: /\.(yml|yaml)$/ }, async (args) => {
        try {
          const file = Bun.file(args.path)
          const content = await file.text()
          
          // YAML 파싱 (실제 구현에서는 js-yaml 같은 라이브러리 사용)
          // 여기서는 간단한 예시로 대체
          const parsed = { message: "YAML 파싱은 js-yaml 라이브러리가 필요합니다" }
          
          return {
            contents: `export default ${JSON.stringify(parsed)}`,
            loader: 'js'
          }
        } catch (error) {
          return {
            contents: `
              console.error("YAML 파싱 오류:", ${JSON.stringify(error.message)});
              export default {};
            `,
            loader: 'js'
          }
        }
      })
    }
  }),

  // TypeScript 플러그인 (Bun은 기본적으로 TypeScript를 지원하므로 간단하게 구현)
  typescript: () => createPlugin({
    name: 'typescript-plugin',
    setup(build) {
      build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => {
        try {
          const file = Bun.file(args.path)
          const content = await file.text()
          
          // Bun은 TypeScript를 기본 지원하므로 별도의 변환 없이 패스스루
          return {
            contents: content,
            loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts'
          }
        } catch (error) {
          return {
            contents: `
              console.error("TypeScript 처리 오류:", ${JSON.stringify(error.message)});
              export default {};
            `,
            loader: 'js'
          }
        }
      })
    }
  })
}

// 해시 생성 유틸리티 함수
function createHash(algorithm) {
  return {
    update(data) {
      this.data = data
      return this
    },
    digest(encoding) {
      // 실제 구현에서는 crypto 모듈 사용
      // 여기서는 간단한 해시 함수로 대체
      const str = typeof this.data === 'string' ? this.data : String(this.data)
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // 32bit 정수로 변환
      }
      return Math.abs(hash).toString(16)
    }
  }
}