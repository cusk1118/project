document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 전송 기본 동작 중단
  
    // 폼 데이터 가져오기
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
  
    // 서버로 데이터 전송
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, password })
    })
    .then(response => response.text())
    .then(message => {
      alert(message); // 서버 응답 메시지 출력
      // 회원가입 성공 후 리다이렉트 등 추가 동작 수행
    })
    .catch(error => {
      console.error('회원가입 중 오류가 발생했습니다.', error);
      // 오류 처리 로직 추가
    });
  });
  