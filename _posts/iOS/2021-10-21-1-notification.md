---
title: "[iOS] Local Notification"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- Notification
toc: true
toc_sticky: true
toc_label: 목차
---

Local Notification은 Push Notification과는 다르다

푸쉬 노티피케이션은 외부 이벤트에 대한 메시지를 받고 원격 서버에서 아이폰과 같은 디바이스로 보내는 메시지를 앱에서 수신할 수 있음

반면 로컬 노티피케이션은 알람 시계와 유사함

특정 시간을 설정하면 알림이 온다.

이렇듯 로컬 노티피케이션은 전적으로 내 장치에서 작동하며, 이를 위해 서버와 같은 외부 인프라가 필요하지 않음

## 권한 얻기

앱은 사용자에게 권한을 요청한 후에만 로컬 노티피케이션을 표시할 수 잇음

사용자가 해당 권한을 수락하지 않는 다면 로컬 노티피케이션이 표시되지 않음

AppDelegate.swift

```swift
import UserNotifications
```

```swift
func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
    let center = UNUserNotificationCenter.current()
    center.requestAuthorization(options: [.alert, .sound]) { grated, error in
        if granted { print("We have permission") }
        else { print("Permission denied") }
    return true
}
```

### application(_:didFinishLaunchingWithOptions:)

`application(_:didFinishLaunchingWithOptions:)` 메소드는 앱의 진입점으로 앱이 시작될 때 호출되어짐

앱이 시작된 후 가장 먼저 코드를 실행할 수 있는 위치.

### UNUserNotificationCenter

앱에 대한 노티피케이션 관련 활동을 관리하기 위한 central object

### requestAuthorization(options:, completionHandler:)

`UNUserNotificationCenter`의 권한을 요청하는 메소드

`options`: 앱이 시스템에게 요청하는 승인 옵션, 여러 옵션을 배열로 전달 가능

사용가능한 옵션 리스트 : `UNAuthorizationOptions` 참조

`completionHandler`: `requestAuthorization`의 결과와 함께 비동기적으로 실행할 블록

`@escaping (Bool, Error?) -> Void)` 형태의 클로저

options로 전달한 권한 요청이 부여된 경우 `Bool` 은 `true`. 거부되면 `false`

오류가 발생될 경우 오류 정보가 포함된 Error 객체가 전달됨

## 로컬 알림 표시

```swift
// 로컬 노티피케이션으로 제공할 정보
let content = UNMutableNotificationContent()
    content.title = "Hello"
    content.body = "I am a local notification"
    content.sound = .default

// 언제 로컬 노티피케이션을 발생 시킬 건지,
let trigger = UNTimeIntervalNotificationTrigger(
    // 초단위
    timeInterval: 10,
    // 반복 여부
    repeats: false)

// 로컬 노티피케이션 생성
let request = UNNotificationRequest(
    // 노티피케이션의 식별자
    identifier: "MyNotification",
    // 노티피케이션으로 제공할 정보
    content: content,
    // 언제 발생 시킬 건지
    trigger: trigger)

// UNUserNotificationCenter에 노티피케이션 추가
center.add(request)
```

어플 실행 10초 후 로컬 노티피케이션 동작

![localNoti.png](/assets/images/Posts/iOS/2021-10-21-localnotification/localNoti.png)

로컬 노티피케이션을 받기 위해서는 어플이 백그라운드 상태에 있어야함

만약 계속 앱을 실행시키고 있다면 아무일도 일어나지 않음

이런 상황을 처리하기 위해서는 `UNUserNotificationCenterDelegate` 델리게이트를 통해 관련된 이벤트를 처리해야함

## UNUserNotificationCenterDelegate

`AppDelegate`에 `UNUserNotificationCenterDelegate` 채택

```swift
// MARK: - User Notification Delegates
func userNotificationCenter(
    _ center: UNUserNotificationCenter, 
    willPresent notification: UNNotification, 
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
) {
    print("Received local notification \(notification)")
}
```

로컬 노티피케이션이 게시되었을 때 여전히 앱이 실행중이면 호출되는 메소드

사용자에게 메시지를 표시하거나 화면을 새로고치는 등의 작업을 진행 가능

```swift
center.delegate = self
```

권한이 허용되었을 때 `center.delegate`를 `self`로 설정

앱을 실행한 후 홈으로 나가지 않으면 아래와 같은 메시지가 출력

```swift
Received local notification <UNNotification: 0x600003af49f0; source: sweetfood-dev.TableViewTutorial date: 2021-10-21 08:00:47 +0000, request: <UNNotificationRequest: 0x600003af6d90; identifier: MyNotification, content: <UNNotificationContent: 0x600000886100; title: <redacted>, subtitle: (null), body: <redacted>, summaryArgument: , summaryArgumentCount: 0, categoryIdentifier: , launchImageName: , threadIdentifier: , attachments: (
), badge: (null), sound: <UNNotificationSound: 0x600001f9d420>, realert: 0, interruptionLevel: 1, relevanceScore: 0.00, trigger: <UNTimeIntervalNotificationTrigger: 0x6000034e37c0; repeats: NO, timeInterval: 10.000000>>, intents: (
)>
```

## 메소드들

### 노티피케이션 request 삭제

```swift
func removeNotification() {
    // Notification 인스턴스 
    let center = UNUserNotificationCenter.current()
    center.removePendingNotificationRequests(withIdentifier:["\(itemID)]
}
```
request 생성시 전달한 identifier를 사용하여 request를 삭제할 수 있음

배열로 전달
