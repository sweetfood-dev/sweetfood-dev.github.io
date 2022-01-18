---
title: "[iOS] Handling Uikit Gestures"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- Event
- Gesture Recognizer
toc: true
toc_sticky: true
toc_label: 목차
---

![](/assets/images/Posts/iOS/2022-01-18-Recognizer/recognizer1.jpeg)

## 요약

1. Gestrue Recognizer 객체는 이벤트의 해석에 필요한 모든 로직을 캡슐화 하고

특정 제스처(패턴)과 일치하면 Target에 notify를 보내서 Action 메소드를 실행 시킴

> Target:Action이 일반적으로 많이 사용되지만 **UIGestureRecognizerDelegate**의 사용도 가능함
> 
1. Gesture Recognizer에는 크게 2가지 타입이 있음
Discrete : 제스처 인식후 action 메소드 한번 호출 
Continuous : 제스처 이벤트 정보가 변결될 때 마다 action 메소드를 호출 ( 여러번 호출이 가능함 )
