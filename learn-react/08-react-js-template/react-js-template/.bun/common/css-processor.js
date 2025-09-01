import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { createHash } from 'node:crypto'

// 루트 디렉토리 설정
const ROOT_DIR = join(import.meta.dir, '../..')

/**
 * CSS @import 구문 처리 함수
 * @param {string} cssContent CSS 내용
 * @param {string} basePath 기준 경로
 * @param {Set} processedFiles 처리된 파일 추적 (순환 참조 방지)
 * @returns {Promise<string>} 처리된 CSS 내용
 */
export async function processCssImports(
  cssContent,
  basePath,
  processedFiles = new Set()
) {
  // @import 구문 정규식
  const importRegex = /@import\s+["']([^"']+)["'];/g

  // 모든 @import 구문 찾기
  let match
  let processedCss = cssContent
  const matches = []

  // 모든 매치를 먼저 찾기
  while ((match = importRegex.exec(cssContent)) !== null) {
    matches.push({
      fullMatch: match[0],
      importPath: match[1],
    })
  }

  // 각 매치 처리
  for (const { fullMatch, importPath } of matches) {
    const fullImportPath = resolveImportPath(importPath, basePath)

    // 파일 존재 확인
    if (existsSync(fullImportPath)) {
      // 순환 참조 확인
      if (processedFiles.has(fullImportPath)) {
        console.warn(`순환 참조 감지: ${fullImportPath}`)
        processedCss = processedCss.replace(
          fullMatch,
          `/* 순환 참조 감지: ${importPath} */`,
        )
        continue
      }

      // 처리 중 상태 추가
      processedFiles.add(fullImportPath)

      // 가져온 CSS 파일 내용 읽기
      const importedCssContent = await readFile(fullImportPath, 'utf-8')

      // 재귀적으로 @import 처리
      const resolvedCss = await processCssImports(
        importedCssContent,
        dirname(fullImportPath),
        new Set(processedFiles),
      )

      // @import 구문을 실제 CSS 내용으로 대체
      processedCss = processedCss.replace(fullMatch, resolvedCss)
    } else {
      console.warn(`CSS @import 파일을 찾을 수 없음: ${fullImportPath}`)
      processedCss = processedCss.replace(
        fullMatch,
        `/* 파일을 찾을 수 없음: ${importPath} */`,
      )
    }
  }

  return processedCss
}

/**
 * CSS @import 경로 해석 함수
 * @param {string} importPath import 경로
 * @param {string} basePath 기준 경로
 * @returns {string} 절대 경로
 */
export function resolveImportPath(importPath, basePath) {
  // 상대 경로인 경우 (./로 시작하거나 ../로 시작)
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return resolve(basePath, importPath)
  }

  // 절대 경로인 경우 (/로 시작)
  if (importPath.startsWith('/')) {
    return join(ROOT_DIR, importPath.slice(1))
  }

  // node_modules에서 가져오는 경우 (예: normalize.css)
  return resolve(ROOT_DIR, 'node_modules', importPath)
}

/**
 * CSS 모듈 변환 함수 - 클래스 이름에 고유 해시 추가
 * @param {string} cssContent CSS 내용
 * @param {string} hash 해시
 * @returns {string} 변환된 CSS
 */
export function transformCssModule(cssContent, hash) {
  // 클래스 선택자 정규식
  const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g

  // 클래스 이름에 해시 추가
  return cssContent.replace(classRegex, (match, className) => {
    return `.${className}_${hash}`
  })
}

/**
 * 파일 경로를 MD5 해시로 변환하는 함수
 * @param {string} path 파일 경로
 * @returns {string} 해시
 */
export function hashPath(path) {
  return createHash('md5').update(path).digest('hex').substring(0, 8)
}

/**
 * CSS 최소화 함수
 * @param {string} cssContent CSS 내용
 * @returns {string} 최소화된 CSS
 */
export function minifyCss(cssContent) {
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // 주석 제거
    .replace(/\s+/g, ' ') // 여러 공백을 하나로
    .replace(/\s*({|}|;|,|:)\s*/g, '$1') // 선택자 주변 공백 제거
    .trim()
}