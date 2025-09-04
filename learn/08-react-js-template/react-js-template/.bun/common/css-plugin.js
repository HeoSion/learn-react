import { dirname } from 'node:path'
import { readFile } from 'node:fs/promises'
import { 
  processCssImports, 
  transformCssModule, 
  hashPath,
  minifyCss 
} from './css-processor.js'

/**
 * CSS 처리 플러그인 생성
 * @param {Object} options 옵션
 * @param {boolean} options.minify CSS 최소화 여부
 * @returns {Object} Bun 플러그인
 */
export function createCssPlugin(options = { minify: false }) {
  return {
    name: 'css-handler',
    setup(build) {
      // CSS 파일 처리
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        try {
          // CSS 파일 내용 읽기
          const cssContent = await readFile(args.path, 'utf-8')

          // @import 구문 처리
          const processedCss = await processCssImports(
            cssContent,
            dirname(args.path),
          )

          // CSS 모듈 처리
          if (args.path.endsWith('.module.css')) {
            // CSS 모듈 변환 - 클래스 이름에 고유 해시 추가
            const hash = hashPath(args.path)
            const cssModuleContent = transformCssModule(processedCss, hash)

            // CSS 모듈을 JS로 변환 - 클래스 이름을 객체로 내보냄
            const classNames = {}
            const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g
            let match

            while ((match = classRegex.exec(processedCss)) !== null) {
              const className = match[1]
              classNames[className] = `${className}_${hash}`
            }

            // 최종 CSS 내용 (최소화 여부에 따라)
            const finalCss = options.minify ? minifyCss(cssModuleContent) : cssModuleContent

            // CSS를 head에 삽입하는 JS 코드 생성
            const jsContent = `
              const style = document.createElement('style');
              style.textContent = ${JSON.stringify(finalCss)};
              document.head.appendChild(style);
              export default ${JSON.stringify(classNames)};
            `

            return { contents: jsContent, loader: 'js' }
          }

          // 일반 CSS 파일 처리 - head에 스타일 삽입
          const finalCss = options.minify ? minifyCss(processedCss) : processedCss

          const jsContent = `
            const style = document.createElement('style');
            style.textContent = ${JSON.stringify(finalCss)};
            document.head.appendChild(style);
            export default {};
          `

          return { contents: jsContent, loader: 'js' }
        } catch (error) {
          console.error(`CSS 처리 오류: ${args.path}`, error)
          return {
            contents: `
              console.error("CSS 처리 오류:", ${JSON.stringify(error.message)});
              export default {};
            `,
            loader: 'js',
          }
        }
      })
    },
  }
}