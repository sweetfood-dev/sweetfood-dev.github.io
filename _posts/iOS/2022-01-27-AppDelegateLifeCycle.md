---
title: "[iOS] AppDelegate Lifecycle"
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
- AppDelegate
toc: true
toc_sticky: true
toc_label: 목차
---

SceneDelegate를 사용하지 않는 프로젝트 기준으로 AppDelegate의 Lifecycle 과정과 호출되는 메소드를 정리

## 개요

`AppDelegate`는 앱의 **공유 동작을 관리하는 메소드의 집합**이다

application안에서 싱글톤의 역할을 맡기도 하는데 그 이유로

1. 앱의 데이터 구조 
2. Scene / View의 구성 
3. 3rd Party Framework
4. Push Notification

위 4가지 말고도 여러 객체 및 인터페이스를 초기화하는 중심위치이기 때문이다.

> 이러한 이유로 AppDelegate 자체가 거대해지는 경우가 많다. 각 역할에 맞게 AppDelegate를 상속 받아 로직을 분리를 하면 Massive AppDelegate를 방지할 수 있다
> 

## 메소드

### application(_:WillFinishLaunchingWithOptions:)

앱의 Launch 프로세스가 시작하고 나서 앱의 **스토리보드, nib 파일이 로드되었지만 아직 Screen에 표시되지는 않은 단계**로 앱의 `state`는 `inactive`(비활성화) 상태이다.

### application(_:DidFinishLaunchingWithOptions:)

앱의 `window` 객체와 기타 `ViewController`, `View`가 Screen에 나타나기 전 단계로 Launch 프로세스가 **거의 완료된 시점에 호출**된다.

> 사용자가 앱을 실행하는 시점 외에도 백그라운드 프로세스에서 OS에 의해 실행되어질 수 있다.
이러한 이유로 이 시점에서 앱의 `state`는 `inactive` / `active` 모두 가능하다
> 

이 시점에서 앱에서 필요한 데이터, 3rd party 프레임워크를 초기화 하기에 적절하다

> ~FinishLaunchingWithOptions 매개변수는 앱이 시작된 이유가 있다면 그 이유에 대한 정보를 나타냄
> 

### applicationDidBecomeActive(_:)

앱의 `state`가 `active`로 **설정되고나서 호출**된다

이 시점에서 `inactive` 동안 일시 중지된 task를 시작하기에 적절한 위치

앱이 백그라운드 프로세싱을 하는 경우 첫 Screen을 초기화하는데 사용이 가능함

단, 백그라운드에서 active로 돌아올 때 마다 새로운 View를 생성하지 않도록 주의

### applicationWillResignActive(_:)

전화 수신, 제어센터 출력, alert 출력등에 의해 앱의 `state`가 `inactive`로 **설정되기 전에 호출**됨

 데이터 저장, 다운로드 일시 중지, API 호출 취소 같은 작업을 진행하기에 좋은 시점

### applicationDidEnterBackground(_:)

**백그라운드로 진입 후에 호출**되는 메소드

UI 업데이트를 비활성화 함

### applicationWillEnterForeground(_:)

백그라운드에서 `active` 상태로 이동할 때 호출됨

이 시점에서 `state`는 아직 `background`임

### applicationWillTerminate(_:)

**앱이 종료되기 직전에 호출**됨

공유 리소스를 해제, 데이터 저장등의 작업에 적절

단, 앱이 백그라운드 실행을 지원할 때 사용자가 백그라운드 상태에서 앱을 종료하면 호출되지 않는 다고 함

## 시나리오별 메소드 호출 순서

### 앱이 처음 실행

1. application(_:WillFinishLaunchingOptions:)
2. application(_:DidFinishLaunchingOptions:)
3. applicationDidBecomeActive

```swift
🔵 AppDelegate application(_:willFinishLaunchingWithOptions:) State: inactive
🔵 AppDelegate application(_:didFinishLaunchingWithOptions:) State: inactive
🔵 AppDelegate applicationDidBecomeActive(_:) State: active
```

### 백그라운드로 진입

1. applicationWillResignActive(_:)
2. applicationDidEnterBackground(_:)

```swift
🔵 AppDelegate applicationWillResignActive(_:) State: active
🔵 AppDelegate applicationDidEnterBackground(_:) State: background
```

### 백그라운드 → 포그라운드

1. applicationWillEnterForeground(_:)
2. applicationDidBecomeActive(_:)

```swift
🔵 AppDelegate applicationWillEnterForeground(_:) State: background
🔵 AppDelegate applicationDidBecomeActive(_:) State: active
```

### 앱 종료(위로 밀어 종료)

1. applicationWillResignActive(_:)
2. applicationDidEnterBackground(_:)
3. applicationWillTerminate(_:)

```swift
🔵 AppDelegate applicationWillResignActive(_:) State: active
🔵 AppDelegate applicationDidEnterBackground(_:) State: background
🔵 AppDelegate applicationWillTerminate(_:) State: background
```

## 참고 및 소스코드

- [소스코드](https://github.com/sweetfood-dev/iOSTutorialProject/tree/main/AppLifeCycle)
- [Medium](https://varga-zolt.medium.com/)
- [About the App Launch Sequence](https://developer.apple.com/documentation/uikit/app_and_environment/responding_to_the_launch_of_your_app/about_the_app_launch_sequence)
