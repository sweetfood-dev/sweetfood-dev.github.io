---
title: "[iOS] Frame과 Bounds"
categories:
- iOS
---

**Frame**<br>
- 상위뷰 좌표 시스템 내에서 View의 위치와 크기<br>
<br>

**Bounds**<br>
- 자기 자신의 좌표시스템에서의 (sub view들의)위치와 크기, 부모뷰와는 관계가 없다
- default origin은 0,0이다
- origin의 변경은 sub view들의 위치가 변경됨을 의미
- sub view의 위치가 변한다는 것은 그려져야하는 위치가 달라지는 것이지 sub view들의 frame 값의 변화는 없다
- 스크롤 시 sub view들의 위치가 달라지는 것이 대표적인 예이다
