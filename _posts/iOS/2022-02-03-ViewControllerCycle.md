---
title: "[iOS] UIViewController Lifecycle"
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
- ViewController
toc: true
toc_sticky: true
toc_label: 목차
---

`ViewController`의 책임 중 하나는 `View`의 **Lifecycle**을 관리하는 것임

![](/assets/images/Posts/iOS/2022-02-03-vclifecycle/vclifecycle.jpeg)

`AppDelegate`에서 앱이 실행되고 `didFinishLaunchingWithOptions`가 호출되고 나면

`ViewController`는 `View`를 화면에 출력하고 모든 `View`가 출력이 되고나면 `DidBecomActive`가 호출되고 이때부터 `Application`의 `state`는 `active`로 전환이 되어짐

`ViewController`가 `View`를 화면에 출력하기 위해서는 

1. `View`를 생성하고
2. 생성된 `View`를 메모리에 올리고
3. 메모리에 적재된 `View`를 설정한 옵션에 따라 배치

크게 위의 **3가지 과정을 거치고, 각 단계 마다 적절한 메소드가 호출**된다

### loadView()

`ViewController`는 모두 기본 `view`라는 프로퍼티가 존재하고

이 프로퍼티를 사용해 `view`를 관리함

`view`는 **옵셔널 타입의 프로퍼티**이기 때문에 이 `view`가 `nil`이면 `view`를 생성하기위해

`ViewController`는 `loadView()` 메소드를 호출한다.

이 메소드를 사용하면 `ViewController`가 관리해야할 `View`를 생성하고 `view` 프로퍼티에 할당하게 됨

> 스토리보드를 사용한다면 이 메소드를 오버라이드 하면 안됨
> 

### viewDidLoad()

view 프로퍼티에 `View`가 **load, 할당이 되고나서 1번 호출**되는 메소드

이 시점에서 View가 메모리에 올라감

View가 생성되었기 때문에 View에 대한 초기화를 수행할 수 있지만

아직 **Bounds가 정해지지 않은 상태**

### viewWillAppear()

`view`가 **화면에 보여지기 직전에 호출**되어짐

`ViewController`가 존재하는 동안 **화면 전환과 같은 이벤트가 발생하면 호출**되기 때문에 여러번 호출이 가능

### viewWillLayoutSubviews

`ViewController`의 `view`의 `subView`의 `layout`을 **변경하기 전에 호출**됨

이 시점부터 `view`의 `bounds`를 알 수 있음

### viewDidLayoutSubviews

`view`와 `subview`들의 **size, position, 제약조건들이 설정**된 시점

### viewDidAppear

`view`가 **화면에 출력**이 되고 호출됨

### viewWillDisappear

`view`가 **화면에서 사라지기 직전에 호출**되어짐

### viewDidDisappear

`view`가 **화면에서 사라지고 난 뒤에 호출**

### didReceiveMemoryWarning

Application에서 개발자가 직접 호출하면 안되는 메소드

**시스템이 사용가능한 메모리가 부족하다고 판단되면 호출**됨

이 메소드를 오버라이드하여 ViewController에서 사용하는 메모리를 해제할 수 있음

### traitCollectionDidChange

**테마(다크/라이트모드)가 변경되거나 Layout, Appearance등이 변경되면 호출**되는 메소드

이 메소드가 호출되는 시점은 `traitCollection`의 변경이 **확정**된 상태

## 시나리오별 메소드 호출 순서

### 첫 실행

1. `loadView`를 통해 UIView가 생성되고 view에 할당
2. view가 메모리에 올라가면 `viewDidload` 호출
3. view를 그리기 전 `viewWillAppear` 호출
4. view를 그리기위한 인터페이스 환경 적용 후 `traitCollectionDidChange` 호출
5. view / subView의 layout 설정을 시작하기 전 `viewWillLayoutSubviews` 호출
6. view / subView의 layout 설정을 마치고 `viewDidLayoutSubviews` 호출
7. view가 화면에 출력되고 `viewDidAppear` 호출

> 1 ~ 6 단계 까지 `Application`의 `state`는 `inactive`이고 7 단계부터 `active` 상태
> 

> 4 ~ 6단계는 view와 subview의 갯수만큼 **반복**
> 

### 백그라운드 진입

1. 인터페이스 환경이 변경되고 `traitCollectionDidChange` 호출
2. `viewWillLayoutSubviews` 호출
3. `viewDidLayoutSubviews` 호출 

> view와 subview의 갯수만큼 **반복**
> 

백그라운드 진입, 백그라운드 → 포그라운드 진입시에 `viewWillAppear` / `viewDidAppear` / `viewWillDisAppear` / `viewDidDisappear` 메소드가 호출될줄 알았는데 호출되지 않는다?

`Application`의 `state`가 `active`상태에서만 호출이 되는것 같음

반면 `traitCollectionDidChange` / `viewWillLayoutSubviews` / `viewDidLayoutSubviews`는 계속 호출 되는되는 이유는 화면에 보여지는 것과 관련되있기 때문인것 같음
