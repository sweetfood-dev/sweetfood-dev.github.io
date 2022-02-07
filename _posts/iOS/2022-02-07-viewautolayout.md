---
title: "[iOS] View Auto Layout"
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
- View
- AutoLayout
- UpdateCycle
- updateConstraints
- layoutSubviews
toc: true
toc_sticky: true
toc_label: 목차
---

## 개요

`View`를 다룰때 가장 기본이되고 중요한 것이 **어떤 크기로 어느위치에 배치할 것인가**라고 생각이 들었다.

이런 `View`의 크기 / 위치를 Layout이라 불리고 이를 기반으로 Auto Layout을 직역하자면

`View`의 크기와 위치 즉, Layout을 자동으로 하는 기술?쯤으로 이해하면 될 것 같다.

이 Auto Layout을 보다 잘 사용하고 더 이해하고자 공부한것을 기록하고자 한다.

### 목차

1. Auto Layout 이해하기
2. Run Loop와 Auto Layout 
3. Auto Layout Process

## Auto Layout 이해하기

**Auto Layout**은 `View` 계층 구조에 존재하는 모든 `View`에 적용된 **제약조건**에 따라 

`View`의 **크기와 위치를 동적으로 계산하는 것**이다.

제약조건이라는 개념을 통해 View의 내부, 외부 변경사항에 **동적으로 응답하는 UI를 구성**할 수 있다는

장점이 존재한다

### 외부 변경사항

`Super View`의 크기나 모양의 변경을 말한다

- 아이폰7과 아이폰13과 같은 **다른 크기를 가진 디바이스**
- 화면의 회전으로 인한 가로/세로 **화면비가 변경되는 상황**

### 내부 변경사항

`Sub View`의 크기의 변경을 말한다

- `Label`의 `Font` 변경으로 인한 `Label` **크기 변경**
- **언어 변경**으로 인한 컨텐츠 크기 변경
- **이미지**의 크기 변경

![](/assets/images/Posts/iOS/2022-02-07-viewAutolayout/innerAndExternalChanges.jpeg)

## UI Layout 방식

![](/assets/images/Posts/iOS/2022-02-07-viewAutolayout/layoutSolution.jpeg)

**Auto Layout**을 포함하여 View를 **Layout하는 방식에는 크게 3가지가 존재**한다

1. Frame 기반의 프로그래밍 방식
2. Auto Resizing Mask
3. Auto Layout

### Frame 기반

`Super View`의 **좌표계**를 기반으로 `View`의 원점, 높이, 너비를 계산하여 `Layout`하는 방식

따라서 `View`를 `Layout`하기 위해서는 `View` 계층 구조의 모든 `View`에 대한 크기, 위치 ( = **Frame**)을 계산해야함

이러한 특성때문에 변경사항이 발생하면 다시 계층구조의 모든 `View`의 `Frame`을 다시 계산해야 한다

- 장점
가장 **유연**하고 개발자가 원하는 대로 `Layout` 변경이 가능함
- 단점
유지 및 관리에 드는 **비용이 큼**
**복잡한 구조**를 가진 UI에 대해서는 **난이도**가 더욱 **증가**

### Auto Resizing Mask

`Super View`의 `Frame`이 변경될 때 `View`의 `Frame`도 함께 변경함으로써 **Frame 기반**의 단점을 일부 보완

> Super View가 커지거나 작아질 때, Sub View가 같이 커지거나 작아질지에 대해서 지원
> 

즉, **외부 변경사항**에 대한 Layout을 단순화함

하지만 UI가 복잡할 경우 Frame 기반의 Layout 방식과 함께 사용해야 하는 한계가 존재함

외부 변경사항에 대한 Layout은 단순화하지만, **내부 변경사항에 대해서는 지원하지 않음**

### Auto Layout

앞의 2가지 방식과는 다른 **새로운 패러다임**

`View`의 `Frame`에 대해서 고려하지 않고 오직 `View`와 `View`사이의 **관계에 대해서만 고려**함

관계는 **제약조건(Constraints)**로 설정하게 된다.

## Run Loop와 Auto Layout

Auto Layout이 **적용되는 시점**을 **Update cycle**이라고 한다

이 Update cycle을 알고 이해하기 위해서는 **Main Run Loop**에 대해 어느정도 알고 있어야 한다

> 기억이 나지 않는 다면 [Main Event Loop](https://sweetfood-dev.github.io/ios/1-maineventloop/)를 한번 읽어보자
> 

Run Loop를 이해하기위해 iOS 시스템에 대해 간단히 복습해보자

1. **Application**이 실행 되면 **Main** 함수를 호출
2. Main 함수 안에서 **UIApplication, UIAppDelegate가 인스턴스화** 됨
3. UIApplication은 이벤트 처리등을 위한 **Main Run Loop**를 실행
4. Main Run Loop는 Event Queue에서 Event를 꺼내와 UIEvent 객체로 변환
5. 이벤트 처리에 적절한 Responder 객체([firstResponder](https://sweetfood-dev.github.io/ios/responderChain/#first-responder-결정))로 4단계 에서 변환된 UIEvent 객체를 전달
6. firstResponder가 전달받은 **이벤트를 핸들링**(처리 / 무시)하고 다시 **Main Run Loop로 제어가 돌아감**
7. 4 ~ 6의 과정을 반복

그렇다면 Run Loop와 Auto Layout이 무슨 관계일까 궁금해진다

바로 **6 단계에서 4 단계로 다시 시작하기전 잠깐의 시간이 Update Cycle이 진행되는 시점**이다.

정리하자면 하나의 이벤트 처리를 끝내고 다음 이벤트를 전달하기 위해 다시 Event Queue에서 가저오기 전이 

Update cycle이 진행되는 시점이다.

### Update Cycle

이벤트 핸들링 과정에서 `View`의 **Layout을 변경**하거나 Update cycle을 **트리거하는 코드가 존재**한다면

> 예를 들어 버튼을 터치하는 이벤트를 처리하는 IBAction 메소드에서 특정 View의 위치를 변경하거나,
BackgroundColor를 변경하는 등의 코드
트리거하는 코드는 아래의 Auto Layout Process에서 따로 설명하겠음
> 

시스템은 `View`를 **다시 그려야 한다고 체크**를 해두고(flag 설정) 이벤트 핸들링이 끝나고 

다시 Main Run Loop로 돌아가 **Update Cycle이 시작하면 체크를 해둔 View에 대한 변경사항을 적용**한다

즉 View의 Layout을 변경하는 **코드가 바로 적용되는 것이 아니라 어느정도 시간을 두고 변경이 적용되는 것**을 의미한다.

> 물론 이 시간차는 사용자가 인지하지 못할정도로 매우 짧지만, 개발자는 알고 있어야 정확하고 의도한대로 기능을 구현할 수 있다.
> 

![](/assets/images/Posts/iOS/2022-02-07-viewAutolayout/UpdateCycleTiming.jpeg)

## Auto Layout Process

Auto Layout의 개념에 대해 알아보고, 어느 시점에서 layout을 적용하는지에 대해 정리가 끝났으니

이제 Auto Layout이 적용되는 과정에 대해 정리해보자

모든 View는 초기화 이후 Update, Layout, Render라는 3개의 단계를 거친다.

- Update : 제약조건을 가지고 **Frame을 계산**
- Layout : Update에서 계산된 Frame을 바탕으로 **View를 배치**(Layout)
- Render : Layout에서 배치된 **View를 실제로 그림**

### Update

제약조건을 가지고 Frame을 계산하는 단계

시스템에 의해 호출되어 **subView → superView순서로 updateConstrations()를 호출**한다

- `updateConstraints()`

오버라이드하여 사용하며 동적으로 변경되는 제약조건을 활성화한다.

시스템에 의해 자동으로 호출되는 경우도 있지만, 수동으로 호출할 수도 있다.

작업이 모두 끝나면 연결된 ViewController의 updateViewConstraitns() 메소드가 호출

단, 수동으로 호출할 때 **명시적(직접) 호출해서는 안되고 위 Update Cycle에서 언급한 트리거로 호출**해야한다.

- `setNeedsUpdateConstraints()`
`updateConstraints()`을 트리거 하는 코드이다.
View의 Layout에 변경사항이 있다고 시스템에 알리고 시스템은 다음 Update cycle에서 
변경된 Layout을 적용
- `updateConstraintsIfNeeded()`
`setNeedsUpdateConstraints()`와 마찬가지로 `updateConstraints()`를 트리거 하는 메소드
단 `setNeedsUpdateConstraints()`와 다르게 다음 Update cycle까지 기다렷다가 적용을 하지 않고
즉시 적용

평소에 View의 위치 / 크기를 변경할 때 위에 메소드들을 사용하지 않았음에도 잘 적용되어 

이 내용이 잘못된거라 생각이 들 수도 있다.

위에 문장을 다시 읽어보면 하나의 문구가 눈에 띈다

> 시스템에 의해 자동으로 호출되는 경우도 있지만, 수동으로 호출할 수도 있다.
> 

몇몇 상황에서 시스템은 자동으로 변경될 Layout을 적용하기 때문에 위의 트리거 메소드들을 사용하지 않아도

적용이 될 것이다.

> 이는 후에 설명할 Layout 단계에서도 마찬가지이다
> 

**자동으로 호출되는 경우**

- 제약이 활성 / 비활성화 될 때
- 제약 조건의 값이나 우선순위가 변경될 때
- View의 제거(`removeFromSuperView`)

### Layout

위 update 단계에서 Constraints(제약조건)을 기반으로 계산된 Frame으로

View / SubView의 Frame이 업데이트 되는 단계

update 단계와는 다르게 **superView → subView순**으로 관련 메소드인 `layoutSubviews()`가 호출

작업이 모두 끝나면 연결된 ViewController의 `viewDidLayoutSubviews()`가 호출됨

- `layoutSubviews()`
view의 Frame이 변경될 때마다 호출됨
`updateConstraitns()`와 마찬가지로 자동으로 호출되는 경우도 있고 수동으로 트리거할 수 있음
`updateConstraitns()`와 마찬가지로 `layoutSubviews()`를 명시적으로 호출해서는 안됨
- `setNeedsLayout()` 
다음 Update Cycle에서 변경사항 적용
- `layoutIfNeeded`()
즉시 변경사항 적용

자동으로 호출되는 경우

- `view`의 크기 변경
- `subView` 추가
- 스크롤
- 회전, 제약조건 업데이트 시 
제약조건 업데이트는 앞서 말한 `updateConstraints()`가 호출된 경우임
제약조건이 변경되면 layout도 변경되기 때문에 호출됨

- 전체적인 흐름

![](/assets/images/Posts/iOS/2022-02-07-viewAutolayout/AutoLayoutProcessWithVC.png)

- View Level 에서 보다 상세한 흐름
    
![](/assets/images/Posts/iOS/2022-02-07-viewAutolayout/viewDetailFlow.png)
    

[적용 프로젝트](https://github.com/sweetfood-dev/iOSTutorialProject/tree/main/Wonderland%20Starter)

## 참고

[UIView Auto Layout life cycle](https://www.vadimbulavin.com/view-auto-layout-life-cycle/)

[Understanding Auto Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/)

[iOS의 레이아웃 사이클](https://daeun28.github.io/이론/post22/)

[View 업데이트](https://jcsoohwancho.github.io/2020-02-17-View-업데이트/)

[Runtime interaction model for view](https://developer.apple.com/library/archive/documentation/WindowsViews/Conceptual/ViewPG_iPhoneOS/WindowsandViews/WindowsandViews.html#//apple_ref/doc/uid/TP40009503-CH2-SW42)

[Demystifying iOS Layout](https://tech.gc.com/demystifying-ios-layout/)

[Easier Auto Layout: Coding Constraints in iOS 9](https://www.raywenderlich.com/1169-easier-auto-layout-coding-constraints-in-ios-9#toc-anchor-013)
