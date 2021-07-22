---
title: ViewController 생명 주기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
popular: true
toc: true
toc_sticky: true
toc_label: 목차
categories:
- iOS
tag:
- View
- Lifecycle
---

# 생명주기
iOS에서는 화면전환을 할 때 기존의 화면 위에 새로운 화면을 쌓는 식으로 화면 전환을 합니다.<br>
이 때 각각의 ViewController는 자신만의 생명주기를 가지고 있습니다<br>
그래서 상황에 맞는 함수들이 호출 되는데 이 생명주기를 나타내는 대표적인 메소드들은 다음과 같습니다<br>
<br>
## ViewDidLoad
- ViewController 클래스가 생성될 때 딱 한번 실행됩니다.
- 보통 초기화 작업이 이루어집니다
## ViewWillAppear
- 화면에 나타나기 직전에 실행됩니다
- ViewDidload와 다르게 나타나기 직전마다 항상 실행됩니다
## ViewDidAppear
- 화면에 나타난 직후에 실행됩니다.
## ViewWillDisAppear
- 화면에서 사라기지 직전에 실행됩니다
## ViewDidDisAppear
- 화면에서  사라지고 난 직후에 실행됩니다
