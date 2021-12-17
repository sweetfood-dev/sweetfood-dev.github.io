---
title: "[iOS] Responder Chain을 사용한 Event Handling"
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
- Responder Chain
- Responder
toc: true
toc_sticky: true
toc_label: 목차
---

## 개요

표준 UIKit의 View, ViewController를 사용하는 경우 자동으로 터치 이벤트를 처리할 수 있다.

반면에 Custom View를 사용하는 경우 Custom View에서 발생하는 모든 이벤트를 처리해야 한다.

업무 중 Custom Slider View를 만들어야 하는 상황이 생겨 관련 내용을 학습하고 내용을 정리해둘 필요가

있어 포스트를 작성하게 되었다.

터치 이벤트를 핸들링하는 데에는

1. Gesture Recognizer를 사용하는 방법
2. UIView를 Subclass한 Custom View에서 직접 핸들링

위와 같은 2가지 방법이 있다.

핸들링 하는 법을 알기 전에 앱에서 이벤트를 처리하는 과정에 대해 이해를 하는 편이 더 도움이 될듯 하다.

[이벤트란](https://sweetfood-dev.github.io/ios/2-event/)

[Main Event Loop를 통한 이벤트의 생성과 전달](https://sweetfood-dev.github.io/ios/1-maineventloop/)

2가지 내용을 먼저 이해하는 것을 추천함

## Using Responder and the Responder chain to Handle events

iOS의 Application은 Responder Objects를 사용해 받은 이벤트를 핸들링함

여기서 말하는 **Reponder 객체는 UIResponder 클래스의 모든 인스턴스**이며 UIResponder를 서브클래싱하는

UIView, UIViewcontroller, UIApplication도 Responder 객체에 포함된다.

Responder 객체는 raw 이벤트를 수신하면 그 이벤트를 **핸들링(처리)**하거나 처리하지 않는다면 

**다른 Responder 객체로 전달**해야 하는 책임을 가진다

Application이 이벤트를 수신하면 UIKit은 자동으로 FirstResponder라고 불리는 가장 적절한

Responder 객체로 수신받은 이벤트를 전달 한다.

핸들링 되지 않은 이벤트는 Application의 Responder 객체의 동적 구성인 active responder chain의

responder에서 responder로 전달된다.

> UIKit은 일정한 규칙을 사용하여 이벤트를 전달, 처리하는 Responder의 순서를 구성하고, 관리하는데
이를 Responder chain이라고 함
> 

![보충그림](/assets/images/Posts/iOS/2021-12-17-Responder/responderChain.png)

예를 들어 위와 같이 UI가 구성되어 있으며 UILabel, UITextField, UIButton에서 이벤트가 발생하고

이 **이벤트를 핸들링하지 않는다면** Responder chain에 의해 다음과 같은 순서로 이벤트가 전달된다.

> 이벤트를 핸들링 하지 않는다면 전달해야하는 책임이 있기에 이벤트를 전달해야 하는것.
전달한다는 것은, 이벤트를 핸들링하는 다른 Responder를 찾기 위해 전달하는 것임
> 
1. UIKit은 처리하지 않은 객체(UILabel, UITextField, UIButton 중 하나)의 부모 뷰로 전달
2. UIView는 UIWindow의 root view인 부모 UIView로 전달.
3. root view인 UIView는 UIWindow로 이벤트를 전달하기 전에 자신을 소유한 UIViewController로 이벤트를 전달
4. UIViewController는 UIWindow로 이벤트를 전달
5. UIWindow는 UIApplication 객체로 이벤트를 전달
6. UIApplication은 UIApplicationDelegate로 이벤트를 전달

즉, 모든 Responder가 이벤트를 핸들링 하지 않는다면 UIApplicationDelegate 객체까지 이벤트가 전달되는

기본 흐름을 가지게 됨

## First Responder 결정

앞서 이벤트를 수신하면 UIKit은 **first responder**객체로 이벤트를 전달한다고 하였고,

first responder를 시작으로 이벤트를 처리하지 않는다면 해당 이벤트를 처리할 responder객체를 찾기 위해 **responder chain**를 사용하여 이벤트를 전달한다고 하였다.

그럼 first responder는 어떻게 결정하는지를 먼저 알아야 할 것이다.

UIKit은 **이벤트 타입**에 따라 이벤트의 first reponder를 결정함

| Event Type | First Responder |
| --- | --- |
| Touch | 터치가 발생한 뷰 |
| Press | 포커스를 가진 객체 |
| Shake-Motion | UIKit 혹은 본인이 정한 객체 |
| Remote-Control | UIKit 혹은 본인이 정한 객체 |
| Editing Menu | UIKit 혹은 본인이 정한 객체 |

controls(아마 UIControl 객체를 말하는 것 같음)은 work message를 사용하여 연관된 target object와 직접 통신함

사용자가 UIButton같은 control 객체와 상호작용( 터치 )을 할 때 control 객체는 target 객체에 work message를 보낸다

work message는 이벤트는 아니지만 responder chain을 사용할 수 있다.

controls 객체의 target이 nil이라면 UIKit은 first responder를 시작으로 적절한 action method를 구현한 객체를 찾을 때 까지 responder chain을 탐색한다

> 이 부분은 UIControl에 대해 추가로 학습하여야 할 것 같음
> 

gesture recognizer는 view보다 먼저 touch / press 이벤트를 수신 받는다

view의 gesture recognizer가 인식하지 못하는 터치는 UIKit이 View로 보내게 된다.

view가 해당 터치를 처리하지 않는 다면 responder chain을 통해 이벤트를 계속 전달함

## Determining Which Responder Contained a Touch Event

UIKit은 View Based hit-testing을 사용해 터치 이벤트가 발생한 위치를 결정한다.

이 터치가 발생한 위치를 View 계층에 존재하는 View들의 bounds와 비교하게 된다

UIView의 `hitTest(_:with:)` 메소드는 뷰 계층을 탐색하여 지정된 터치를 받는 가장 깊은 sub view를 찾아

first responder로 지정한다

UIKit은 터치가 발생하면 UITouch 객체를 생성하고 View와 연관을 짓는다

UIKit은 터치의 위치나 다른 파라미터가 변경되면 동일한 UITouch 객체를 변경된 새 정보로 업데이트 한다.

UITouch 객체의 변경되지 않는 유일한 프로퍼티는 UITouch 객체를 생성할 때 연관지은 View이다.

즉 UITouch 객체의 터치 위치가 연관된 View 범위 밖으로 나가더라도 View 프로퍼티는 변경되지 않는다.

터치가 끝나는 시점에 UITouch 객체는 UIKit에 의해 release 되어진다.

## Altering the Responder Chian

responder 인스턴스의 `next` 프로퍼티를 오버라이드 하면 responder chain을 변경할 수 있다.

이미 많은 UIKit의 클래스가 이 `next` 프로퍼티를 오버라이드하여 특정한 객체를 반환한다

- UIView: 자신이 ViewController의 root view인 경우 `next`를 해당 ViewController로 설정
그렇지 않은 경우 자신의 super view로 지정한다
- UIViewController : window의 rootView라면 next는 window로 설정하지만
그렇지 않은 다른 ViewController에 의해 **present** 되었다면 present를 한 ViewController로 설정한다
- UIWindow : window의 `next`는 UIApplication 객체
- UIApplication : `next`는 AppDelegate 객체이지만 AppDelegate가 UIResponder 타입이고, View
ViewController, UIApplication 자체가 아닌 경우에만 `next`로 설정이 가능하다

## 관련 클래스

### UIResponder

이벤트에 응답하고 처리할 수 있는 객체

이벤트가 발생하면 UIKit은 처리를 위해 UIResponder타입의 객체에 발생한 이벤트를 전달

UIView, UIViewController, UIWindow, UIApplication을 비롯한 주요 객체들은 대부분 UIResponder를 상속함

이벤트의 종류에는 터치, 모션, 원격제어, press등 여러 종류가 있는데

특정 이벤트의 처리를 위해서는 연관된 관련 메소드를 오버라이드 해야함

예를 들어 터치 이벤트의 경우

touchBegan, touchMoved, touchEnded, touchCancelled 메소드로 터치 이벤트를 처리할 수 있음

UIResponder 인스턴스가 이벤트를 처리하지 않는 경우 다른 responder 인스턴스로 전달해야함

이때 responder chain을 따라 responder로 전달이되어짐.

### UIEvent

앱과 사용자의 상호작용을 설명하는 객체

앱은 다양한 type의 이벤트를 받을 수 있음. 앱에서는 터치 이벤트가 가장 일반적이다

`UIEvent`의 `type`/`subtype` 프로퍼티를 사용해 이벤트의 타입을 결정할 수 있음

터치 이벤트는 화면의 손가락을 포함함. 터치 타입의 이벤트는 하나 이상의 터치를 포함할 수 있고

이 터치는 `UITouch`타입의 객체로 표현된다.

이벤트가 발생되면 시스템은 적절한 responder로(first responder) 이벤트를 전달하고

touchBegan같은 특정 이벤트 타입에 대한 연관된 메서드를 호출한다

UIEvent 객체는 재사용되므로 UIEvent 객체, UIEvent 객체에서 반환된 객체를 유지하며 사용해서는 안된다.

> 해당 인스턴스를 프로퍼티로 참조하지 말자라는 의미 같음
> 

불가피하게 유지를 해야하는 경우 필요한 데이터만 로컬 데이터 struct에 **복사**하여 사용해야함

정리하자면 이벤트가 발생되면 생성되는 이벤트 타입을 설명하는 객체이며 시스템에 의해 responder에 전달되어짐

### UITouch

터치의 위치, 크기, 움직임, 강도를 나타내는 객체

UIEvent 객체를 통해 접근할 수 있음

UITouch는 다음을 포함함

- 터치가 발생한 View / WIndow
- View / Window 내에서 터치가 발생한 위치
- 대략적인 반경
- 터치의 강도

이 밖에도 터치한 시간을 의미하는 타임스탬프, 탭한 횟수, 터치 단계 ( 시작 / 종료 / 이동 / 취소)를 포함함
