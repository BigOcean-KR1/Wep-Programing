# 📋 DB 없이 구현하는 자유게시판 가이드 (Local Storage 활용)

이 가이드는 서버나 데이터베이스(DB) 연결 없이, 웹 브라우저의 기본 기능을 사용하여 게시판 데이터를 저장하고 관리하는 방법에 대해 설명합니다.

---

## 1. 개요 (Approach)
일반적으로 게시판은 서버(Backend)와 데이터베이스(MySQL, MongoDB 등)를 필요로 합니다. 하지만 이 프로젝트에서는 **브라우저 로컬 스토리지(Local Storage)**를 활용하여 별도의 서버 비용이나 설정 없이 데이터를 반영구적으로 저장합니다.

## 2. 핵심 기술: Local Storage
*   **정의**: 사용자의 웹 브라우저에 데이터를 키-값(Key-Value) 쌍으로 저장할 수 있는 저장소입니다.
*   **특징**: 
    - 브라우저를 닫거나 컴퓨터를 재부팅해도 데이터가 유지됩니다.
    - 서버로 전송되지 않으므로 보안이 중요한 정보(비밀번호 등) 저장에는 적합하지 않지만, 단순한 게시글 저장에는 매우 효율적입니다.
    - 약 5MB 내외의 문자열 데이터를 저장할 수 있습니다.

---

## 3. 구현 단계 (Implementation Details)

### STEP 1: HTML 제출 폼 및 리스트 영역
`index.html`에 사용자로부터 이름, 이메일, 내용을 입력받을 `input` 및 `textarea`를 만들고, 저장된 글이 표시될 `div` 영역(`board-list`)을 준비합니다.

### STEP 2: 데이터 저장 (JavaScript)
입력된 데이터를 객체(Object) 형태로 묶고, 이를 JSON 문자열로 변환하여 저장합니다.
```javascript
// 게시글 객체 생성
const newPost = { name, email, content, date: new Date().toLocaleString() };

// 기존 데이터 불러오기
const posts = JSON.parse(localStorage.getItem('board_posts') || '[]');

// 새 글 추가 및 재저장
posts.push(newPost);
localStorage.setItem('board_posts', JSON.stringify(posts));
```

### STEP 3: 데이터 불러오기 및 화면 출력
페이지가 로드될 때 스토리지를 읽어와 HTML 요소를 동적으로 생성합니다.
```javascript
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
  posts.reverse().forEach(post => {
    // HTML 템플릿 생성 및 board-list에 추가
  });
}
```

---

## 4. 이 방식의 장단점

### ✅ 장점
- **속도**: 서버 통신이 없으므로 데이터 처리가 즉각적입니다.
- **비용**: 서버 유지비나 DB 비용이 전혀 들지 않습니다.
- **간편함**: 복잡한 환경 설정 없이 `index.html`, `script.js`만으로 구동됩니다.

### ⚠️ 단점
- **기기 종속성**: 노트북에서 쓴 글을 스마트폰에서 볼 수 없습니다. (현재 사용 중인 기기에만 저장됨)
- **보안**: 사용자가 직접 브라우저 개발자 도구에서 데이터를 수정하거나 삭제할 수 있습니다.
- **초기화**: 브라우저 캐시를 모두 삭제하거나 시크릿 모드를 사용하면 데이터가 사라질 수 있습니다.

---

## 5. 향후 확장 가이드 (Next Steps)
추후에 모든 사용자가 글을 공유하고 데이터를 안전하게 관리하고 싶다면 다음 단계로 확장할 수 있습니다.
1. **Firebase**: 구글의 플랫폼으로, 복잡한 서버 코드 없이 실시간 DB 연동이 가능합니다.
2. **Node.js + MongoDB**: 가장 표준적인 풀스택 구성으로 서버를 구축합니다.
3. **Supabase**: PostgreSQL 기반의 오픈소스 대안으로 쉽게 연동 가능합니다.

---
*이 문서는 한화에어로스페이스 포트폴리오 프로젝트의 일부로 작성되었습니다.*
