---
title: "[iOS] Application LifeCycle"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- LifeCycle
- Application
toc: true
toc_sticky: true
toc_label: 목차
---

Application, AppDelegate, ViewController, View의 lifecycle에 대해 더 자세히 이해하고 싶어서 포스트를 작성함

## 앱 실행 순서

![](/assets/images/Posts/iOS/2022-01-26-ApplicationLifcycle/Applicationlifecycle.jpeg)

1. 사용자 또는 시스템이 앱을 실행하거나 시스템이 앱을 **prewarm**함 
2. 시스템은 Xcode가 제공하는 `main()` 함수를 실행함
3. main() 함수는 UIApplicationMain(_:_:_:_:)을 호출하여 UIApplication, AppDelegate 인스턴스를 생성
4. UIKit은 Info.plist 파일 혹은 설정에서 지정된 default 스토리보드를 load 
5. UIKit은 AppDelegate의 application(_:willFinishLaunchingWithOptios:)를 호출
6. UIKit은 state 복원을 실행하여 AppDelegate와 앱의 ViewController에서 추가 메소드를 실행
7. UIKit은 AppDelegate의 application(_:didFinishLaunchingWithOptios:)를 호출

해당 순서의 앱 실행 시퀀스가 완료되면 시스템은 AppDelegate 혹은 SceneDelegate를 사용해 UI를 표시하고 lifecycle을 관리

> prewarm은 iOS15 이상의 특정 기기에 따라 사용자가 앱을 사용하기 위해 기다리는 시간을 줄이는 기술
>

> 스토리보드를 사용하지 않는 프로젝트는 4 단계를 skip
>
