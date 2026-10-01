
- 2026-10-02 product-page v030: 약관 제5~9조 추가(제3자 도구·지킬 것·AI 결과물과 베타·보안과 취약점 신고·책임의 한계, make_site.py 끝의 TERMS_MORE). 변호사 검토 없음. Anthropic 문서(code.claude.com/docs/en/legal-and-compliance)와 대조함, OpenAI 브랜드 문서는 403으로 못 봄.
- 같은 버전: 이메일 칸 벗어날 때 형식 검사(신청·의견·오픈 알림), 신청 폼 AI 도구 보기 10개(구글폼과 글자 일치 확인), 허브 충돌 안내 상자 삭제, 도움말 0.1.45(VERSION도), feedback(.ko).html?v=0.1.46 이면 앱 버전 칸 채움(숫자·점만).
- PR #1 = v030. 병합은 총괄(사용자가 총괄에게 맡김). 병합 뒤 `python check_site.py https://genok.app`.
- 사용자 상시 규칙: 사람에게 보이는 폼은 구글폼 화면을 쓰지 않는다. 우리 사이트 페이지로 만들고 답만 구글폼에 저장. forms.gle 링크를 밖에 내보내지 않는다.
- 남은 것: 메일 2개(beta-mails v14, beta-launch v6)에 forms.gle 링크 1건씩 → 사이트 공개 뒤 genok.app/feedback 주소로 교체. 플랜 이름 Lite/Pro는 v030 질문의 답을 기다림. 변경 기록의 "설정 › 버전"은 Dev 답("설정 › 정보 › 지금 버전")과 다름, Dev 확인 필요.
