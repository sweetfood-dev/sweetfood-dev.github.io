---
title: "[iOS] SceneDelegate"
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
- SceneDelegate
- AppDelegate
toc: true
toc_sticky: true
toc_label: 목차
---

## 개요

iOS 13이전 AppDelegate는 2개의 책임을 담당함

![AppDelegateiOS12.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/AppDelegateiOS12.png)

1. 프로세스 Level의 이벤트
2. UI State(Lifecycle)

이것은 **1개의 프로세스**가 일치하는 **1개의 UI**만이 존재하는 상황에서는 완벽하게 동작함

하지만 iOS13를 포함한 그 이후 버전에서는 여전히 **하나의 프로세스를 공유**하지만 **UI 혹은 Scene은 여러개**가

**존재**할 수 있기 때문

따라서 AppDelegate의 책임이 변경되야 했음

**프로세스 Level의 이벤트와 LifeCycle은 여전히 AppDelegate가 담당**하지만

**UI State / Lifecycle은 더이상 담당하지 않음**

그렇다면 UI State / Lifecycle은 누가 관리 하는가?

바로 **SceneDelegate**가 담당하여 관리를 하게 됨

![AppDelegateiOS13.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/AppDelegateiOS13.png)

기존에 AppDelegate가 담당하던 UILifeCycle 관련 메소드들의 이름은 대부분 SceneDelegate에서

**1:1로 매칭**이 되어짐

![lifecyclemethodmaching.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/lifecyclemethodmaching.png)

AppDelegate는 **하나의 책임이 더 추가**되는데

바로 **Scene Session 변경**에 대한 이벤트 관련 책임이다.

Scene Session이 **생성되거나 삭제될 때** 시스템은 해당 정보를 AppDelegate에 알리게 됨

![AppDelegateSessionLifecycle.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/AppDelegateSessionLifecycle.png)

## 실행 프로세스

위 배경을 이해하고 실제로 어떠한 프로세스로 관련 메소드가 호출되는지 알아보자

### 초기 실행

![LaunchProcess.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/LaunchProcess.png)

앱이 실행되면 이전과 같이 AppDelegate의 didFinishLaunching 메소드가 호출된다

그리고 **configurationForSession**이라는 새로운 메소드가 호출된다.

이 메소드는 어떤 Scene을 보여주기 전에 호출되는 메소드로 새로운 Scene을 만들 때 사용할 UIKit의 Configuration Data를 검색하여 반환한다.

Configuration Data는 UISceneConfiguration에 존재하며

이 객체에는 생성할 Scene의 타입, 보여줄 초기 View Controller, Scene을 관리할 Delegate객체 정보가 존재함

앱이 실행되었지만 **아직 이 단계에서까지는 Screen에 UI가 나타지 않는다**

![LaunchProcess2.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/LaunchProcess2.png)

이 단계에서 **willConnectToSession**이 호출됨

해당 메소드는 앱이 UI의 인스턴스를 생성하거나 복원할 때 호출되어진다

이 메소드를 사용하여 새로운 Scene 추가에 응답하고 Scene이 표시해야하는 데이터를 로드할 수 있음

이 메소드가 호출되고 나면 위 그림과 같이 UI가 나타남

### 백그라운드 진입

앱이 모두 실행된 상태에서 백그라운드 진입 ( 홈 화면으로 이동 )하는 프로세스는 다음과 같다

![goBackground.png](/assets/images/Posts/iOS/2022-02-09-scenedelegate/goBackground.png)

기존 iOS 13 이전에서의 AppDelegate에서와 같이 

willResignActive → didEnterBackground가 호출되어진다

이후 백그라운드 상태에서 어느 시점에 didDisconnect가 호출되며 Scene과의 연결이 끊어진다.

> didDisconnect는 연결된 Scene과의 연결이 끊어 지면 호출되는 메소드
> 

리소스를 회수하기 위해 메모리에서 Scene이 해제되는데

이 과정에서 SceneDelegate 또한 메모리에서 해제되고, 따라서 SceneDelegate가 관리하는

모든 Window / View 계층도 해제된다

## 참고

[https://varga-zolt.medium.com/scenedelegate-lifecycle-part-7-510542d61bf6](https://varga-zolt.medium.com/scenedelegate-lifecycle-part-7-510542d61bf6)

[https://zeddios.tistory.com/811](https://zeddios.tistory.com/811)

[https://developer.apple.com/videos/play/wwdc2019/258/?time=239](https://developer.apple.com/videos/play/wwdc2019/258/?time=239)
