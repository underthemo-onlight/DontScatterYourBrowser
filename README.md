# Personal Dashboard

React + TypeScript + Tailwind CSS로 제작한 개인 생산성 대시보드입니다.

## 프로젝트 개요

벤토 그리드 디자인을 활용한 반응형 개인 대시보드로, 북마크, 할 일, 세계 시계, 습관 트래커 기능을 제공합니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite 7** - 빌드 도구
- **Tailwind CSS v3** - 스타일링
- **lucide-react** - 아이콘
- **localStorage** - 데이터 저장

## 주요 기능

### 1. 북마크 위젯 (2x4)
- 북마크 추가 (제목, URL, 태그, 메모)
- 태그별 필터링
- 검색 기능
- 순서 변경 (위/아래 화살표)
- 삭제 기능

### 2. Todo 위젯 (2x2)
- Todo 추가 (Enter 키 지원)
- 체크박스로 완료/미완료 토글
- 삭제 기능
- 진행 상황 표시 (완료/전체)

### 3. 세계 시계 위젯 (2x1)
- 도시 이름과 현재 시간 표시
- 주요 도시 추가/삭제 (New York, London, Tokyo, Sydney 등)
- 실시간 업데이트 (매초)

### 4. 습관 트래커 위젯 (2x1)
- 습관 목록 관리
- 오늘 완료 체크
- 연속 일수(streak) 계산
- 총 완료 횟수 표시

## 반응형 레이아웃

- **데스크탑 (1024px+)**: 4열 그리드
- **태블릿 (768px~1023px)**: 2열 그리드
- **모바일 (~767px)**: 1열 스택

## 설치 및 실행

### 필수 요구사항

- Node.js 20.19+ 또는 22.12+

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# nvm 사용 시
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
nvm use 20

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:5173/ 열기

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
dashboard/
├── src/
│   ├── components/
│   │   ├── BookmarkWidget.tsx    # 북마크 위젯
│   │   ├── TodoWidget.tsx         # Todo 위젯
│   │   ├── WorldClockWidget.tsx   # 세계 시계 위젯
│   │   ├── HabitTrackerWidget.tsx # 습관 트래커 위젯
│   │   └── Dashboard.tsx          # 메인 대시보드 레이아웃
│   ├── types.ts                   # TypeScript 타입 정의
│   ├── App.tsx                    # 앱 진입점
│   ├── main.tsx                   # React 렌더링
│   └── index.css                  # 전역 스타일 (Tailwind)
├── public/                        # 정적 파일
├── tailwind.config.js             # Tailwind 설정
├── postcss.config.js              # PostCSS 설정
├── tsconfig.json                  # TypeScript 설정
└── vite.config.ts                 # Vite 설정
```

## 데이터 저장

모든 데이터는 브라우저의 **localStorage**에 자동으로 저장됩니다:
- `bookmarks` - 북마크 데이터
- `todos` - Todo 리스트
- `worldClocks` - 세계 시계 도시 목록
- `habits` - 습관 트래커 데이터

## 주요 기능 특징

- 부드러운 애니메이션 효과
- 카드 호버 시 살짝 떠오르는 효과 (box-shadow)
- 커스텀 스크롤바
- 반응형 디자인
- localStorage 자동 저장/로드
- TypeScript 타입 안정성

## 개발 환경 설정

### Node.js 업그레이드 (필요 시)

```bash
# Homebrew로 nvm 설치
brew install nvm

# nvm 디렉토리 생성
mkdir ~/.nvm

# nvm 활성화 (~/.zshrc 또는 ~/.bash_profile에 추가)
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"

# Node.js 20 설치
nvm install 20
nvm use 20
nvm alias default 20
```

## 라이선스

MIT
