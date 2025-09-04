import { join } from 'node:path'
import { loadConfig, mergeConfig } from './config-loader.js'
import { loadEnv, resolveMode } from './env.js'
import { PluginSystem, builtinPlugins } from './plugin-system.js'
import { loadServerConfig } from './server-config.js'
import { createOptimizedBuildConfig } from './optimizer.js'
import { createTypeScriptPlugin } from './typescript.js'

// 기본 설정
const defaultConfig = {
  root: process.cwd(),
  mode: resolveMode(),
  server: {
    port: 3000,
    host: 'localhost',
    cors: true,
    https: false,
    proxy: {},
    open: false,
    hmr: true
  },
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: 'external',
    target: 'browser',
    splitting: true,
    treeshake: true
  },
  plugins: []
}

// 설정 로드
export async function resolveConfig() {
  // 사용자 설정 로드
  const userConfig = await loadConfig()
  
  // 모드 결정
  const mode = userConfig.mode || defaultConfig.mode
  
  // 환경 변수 로드
  const { env, clientEnv, define } = loadEnv(mode, userConfig.root)
  
  // 설정 병합
  const config = mergeConfig(defaultConfig, userConfig)
  
  // 플러그인 시스템 초기화
  const pluginSystem = new PluginSystem()
  
  // 내장 플러그인 등록
  pluginSystem.use(builtinPlugins.css())
  pluginSystem.use(builtinPlugins.json())
  pluginSystem.use(builtinPlugins.image())
  
  // TypeScript 지원 추가
  pluginSystem.use(createTypeScriptPlugin({ root: config.root }))
  
  // 사용자 플러그인 등록
  for (const plugin of config.plugins) {
    pluginSystem.use(plugin)
  }
  
  // 빌드 설정 최적화
  const buildConfig = createOptimizedBuildConfig({
    entrypoints: [join(config.root, 'src', 'main.jsx')],
    outdir: join(config.root, config.build.outDir),
    minify: config.build.minify,
    target: config.build.target,
    sourcemap: config.build.sourcemap,
    define
  })
  
  // 플러그인 적용
  const finalBuildConfig = await pluginSystem.applyToBuildConfig(buildConfig)
  
  return {
    ...config,
    env,
    clientEnv,
    define,
    pluginSystem,
    buildConfig: finalBuildConfig,
    serverConfig: loadServerConfig(userConfig.configPath)
  }
}