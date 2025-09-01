# 리액트 + 타입스크립트

멋사 프론트엔드 14기 4주차 수업부터 타입스크립트로 마이그레이션합니다.

> 마이그레이션(Migration)  
> 코드베이스 언어를 변경하거나, 기존 시스템을 새로운 환경으로 이동하는 작업을 의미

## TypeScript 마이그레이션 구성

TypeScript 마이그레이션을 위해 패키지가 추가되거나,  
구성 파일이 수정 또는 추가되었습니다.

### 추가된 패키지

- `typescript: "^5.9.2"`
- `typescript-eslint: "^8.40.0"`
- `@types/eslint-plugin-jsx-a11y: "^6.10.0"`
- `@types/node: "^24.3.0"`
- `@types/react: "^19.1.10"`
- `@types/react-dom: "^19.1.7"`

### 수정 또는 추가된 구성 파일

- `vite.config.ts`
- `eslint.config.ts`
- `tsconfig.node.json`
- `tsconfig.json`

## TypeScript 마이그레이션

기존에 작성된 JavaScript 코드를 TypeScript 코드로 변경하는 과정을 진행합니다.

- `src/demo/main.jsx`
- `src/demo/app.jsx`
- `src/demo/components/**/*.(js|jsx)`
- `src/demo/**/*.(js|jsx)`
- `src/utils/**/*.js`