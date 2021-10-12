---
title: "[OpenSource] - Snapkit"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- Autolayout
- Snapkit
- Open Source
toc: true
toc_sticky: true
toc_label: 목차
---

오토레이아웃과 `Constraitns`를 쉽게 사용할 수 있도록 해주는 경량 DSL인 Snapkit에 대해 알아보자

오토레이아웃은 다양한 뷰들과 뷰 계층간의 관계와 제약조건을 설명하는 강력한 도구이지만

직관적이지 않음

프로그래밍 방식으로 작성할 때 Visual Formatting Language나 NSLayoutConstraints를 수동으로 생성하였으나 이 역시 장황하고 복잡한 것이 사실이다

iOS9 부터는 레이아웃 앵커를 도입하여 이전보다는 크게 개선되었으나 그럼에도 불구하고 더 빠르고 쉽게 만들기 위한 다른 무언가가 필요하였다.

여기서 마랗는 다른 무언가. 그것이 바로 오늘 알아볼 Snapkit이다.

## DSL?

DSL은 Domain-Specific Language의 약자로 특정 도메인을 표현하고 특정 문제를 해결하고자 만들어진 언어이다.

Snapkit은 오토레이아웃 제약 조건에 대한 특정 문제에 대해 직관적이고 사용하기 쉬운 구문을 만드는 것을

목표로 만들어진 라이브러리다

Snapkit이 없어도 Snapkit이 하는 모든 작업을 할 수 있지만

Snapkit은 더 유창하고 더 쉬운표현을 제공하는 Sugar구문이기 때문에 많이 사용되고 있다.

## Snapkit Basic

슈퍼뷰의 모든 모서리에 새로운 뷰를 연결하는 일반적인 제약조건 사용을 예로 들어보자

![snapkit_basics.png](/assets/images/Posts/iOS/2021-10-12-snapkit/snapkit_basics.png)

일반적인 코드는 다음과 같을 것이다.

```swift
child.translatesAutoresizingMaskIntoConstraints = false

NSLayoutConstraint.activate([
    child.leadingAnchor.constraint(equalTo: parent.leadingAnchor),
    child.topAnchor.constraint(equalTo: parent.topAnchor),
    child.trailingAnchor.constraint(equalTo: parent.trailingAnchor),
    child.bottomAnchor.constraint(equalTo: parent.bottomAnchor),
])
```

보기 불가능할 정도는 아니지만 이를 Snpkit을 사용하면 더 직관적이고 이해가 쉽게 작성할 수 있다

Snapkit은 모든 `UIView` 타입에 `snp`라는 네임스페이스를 제공함

snp는 `makeConstraints(_:)` 메서드와 함께 Snapkit의 핵심

위의 코드를 Snapkit에서는 다음과 같이 작성할 수 있음

```swift
child.snp.makeConstraints { make in
    make.leading.equalToSuperview()
    make.top.equalToSuperview()
    make.trailing.equalToSuperview()
    make.bottom.equalToSuperview()
}
```

비슷한 양의 코드 같아 보이지만 가독성에 있어서는 크게 향상된 것을 볼 수 있음

다음 2가지에 대해서 주목할 필요가 있음

1. `equalToSuperView()` 덕분에 부모뷰를 참조하지 않아도 됨
이는 자식이 부모뷰를 바꾸게 되는 상황에 이 코드를 수정하지 않아도 됨을 의미
2. `make`를 사용한 구문은 영어의 문법과 유사하다. 따라서 직관적으로 이해할 수 있음

### 구성과 연결 (Composability & Chaining)

Snapkit에서는 모든 앵커와 제약조건 자체를 연결할 수 있음

즉 위의 코드를 다음과 같이 작성할 수 있다

```swift
child.snp.makeConstraints { make in 
    make.top.leading.trailing.bottom.equalToSuperview()
}
```

이와 같은 동작을 하도록 더 간결하게 작성도 가능하다

```swift
child.snp.makeConstraints { make in 
    make.edges.equalToSuperview()
}
```

같게 하는것이 아니라 `inset`에 16을 더해주고 싶다면

```swift
child.snp.makeConstraints { make in 
    make.edges.equalToSuperview().inset(16)
}
```

이런 구성과 연결은 Snapkit의 핵심이며 덕분에 기본 `NSLayoutConstraints`보다 뛰어난 표현련을 제공한다

## 실전!

이제 기존의 `NSLayoutConstraints`를 Snapkit으로 바꿔 더 많은 기능을 알아보고 느껴보자

[[다음 예제 프로젝트를 참조](https://github.com/sweetfood-dev/OpenLibraryStudy/tree/main/SnapKit_Example_byRaywenderich)]

`setupConstraints()` 메서드의 내용을 수정해보자

`lblTimer`의 제약조건 블럭을 수정하는 것을 시작으로 천천히 모든 블럭을 수정해보자

```swift
/* Default NSLayoutConstraint - lblTimer
lblTimer.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
lblTimer.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.45),
lblTimer.heightAnchor.constraint(equalToConstant: 45),
lblTimer.topAnchor.constraint(equalTo: viewProgress.bottomAnchor, constant: 32),
lblTimer.centerXAnchor.constraint(equalTo: view.centerXAnchor)
])
*/
// Snapkit Constraint - lblTimer
lblTimer.snp.makeConstraints { make in
    make.width.equalToSuperview().multipliedBy(0.45)
    make.height.equalTo(45)
    make.top.equalTo(viewProgress.snp.bottom).offset(32)
    make.centerX.equalToSuperview()
}
```

> SnapKit은 더 이상 `translatesAutoresizingMaskIntoConstraints`를 `false`로 설정할 필요가 없다
내부에서 설정을 해준다!
> 

`lblQuestion`에 대해서도 수정을 해보자

```swift
/* Default NSLayoutConstraint - lblQuestion
lblQuestion.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
lblQuestion.topAnchor.constraint(equalTo: lblTimer.bottomAnchor, constant: 24),
lblQuestion.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 16),
lblQuestion.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -16)
])
 */
// Snapkit Constraint - lblQuestion
lblQuestion.snp.makeConstraints { make in
    make.top.equalTo(lblTimer.snp.bottom).offset(24)
    //      make.leading.equalToSuperview().offset(16)
    //      make.trailing.equalToSuperview().offset(-16)
    // 위 코드는 다음과 같음
    make.leading.trailing.equalTo(view.safeAreaLayoutGuide).inset(16)
}
```

주석 처리된 `leading`, `trailng` 설정의 각 라인은 슈퍼뷰로 부터 16만큼 `offset`을 주는 것과 같은 작업이다.

**chain**을 사용하면 라인 하나에서 모든 처리를 할 수 있다.

눈여겨 볼 포인트는 다음과 같다

1. `leading`과 `tailing`은 앞서 설명한 것처럼 연결되어 사용할 수 있다
2. 제한조건을 설정하기 위해 항상 `snp` 네임스페이스를 사용할 필요는 없다

`inset`에 꼭 숫자일 필요는 없다 

다음 코드는 `UIEdgeInsets` 타입을 사용한 예이다.

```swift
make.leading.trailing.equalTo(view.safeAreaLayoutGuide)
  .inset(UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16))
```

`lblMessage`도 수정해보자.

```swift
/* Default NSLayoutConstraint - lblMessage
lblMessage.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
lblMessage.topAnchor.constraint(equalTo: navView.topAnchor),
lblMessage.bottomAnchor.constraint(equalTo: navView.bottomAnchor),
lblMessage.leadingAnchor.constraint(equalTo: navView.leadingAnchor),
lblMessage.trailingAnchor.constraint(equalTo: navView.trailingAnchor)
])
*/
// Snapkit Constraint - lblMessage
lblMessage.snp.makeConstraints { make in
    make.edges.equalToSuperview()
}
```

이어서 `svButtons`도 수정을 진행하자

```swift
/* Default NSLayoutConstraint - svButtons
 svButtons.translatesAutoresizingMaskIntoConstraints = false
 NSLayoutConstraint.activate([
 svButtons.leadingAnchor.constraint(equalTo: lblQuestion.leadingAnchor),
 svButtons.trailingAnchor.constraint(equalTo: lblQuestion.trailingAnchor),
 svButtons.topAnchor.constraint(equalTo: lblQuestion.bottomAnchor, constant: 16),
 svButtons.heightAnchor.constraint(equalToConstant: 80)
 ])
 */
// Snapkit Constriant - svButtons
svButtons.snp.makeConstraints { make in
    make.leading.trailing.equalTo(lblQuestion)
    make.top.equalTo(lblQuestion.snp.bottom).offset(16)
    make.height.equalTo(80)
}
```

이 코드에서 `make.leading.trailing.equalTo(lblQuestion)`를 유심히 봐보자

`leading`, `trailing`이 `lblQuestion`과 같아야 한다고 정의만 하였다

```swift
make.leading.equalTo(lblQuestion.leading)
make.trailing.equalTo(lblQuestion.trailing)
```

위와 같이 정의하지 않아도 `lblQuestion`만 툭 전달해줘도 동작이 된다는 뜻이다.

이는 Snapkit이 특정 제약 조건을  참조하고 있다고 추론할 수 있다.

이는 단순한 제약조건도 마찬가지다.

```swift
view.snp.makeConstraints { make in
    make.width.equalTo(otherView.snp.width)
    make.centerX.equalTo(otherView.snp.centerX)
}
```

```swift
view.snp.makeConstraints { make in
    make.width.equalTo(otherView)
    make.centerX.equalTo(otherView)
}
```

위 두개의 코드는 모두 동일하게 동작한다

`othreView`의 `width`, `centerX`가 필요하지 않다.

이미 `view`의 `width`, `centerX`를 기반으로 생성해야 하는 제약조건의 종류를 알고 있기 때문이다.

즉 위의 코드는 한줄의 코드로도 작성이 가능하다

```swift
make.width.centerX.equalTo(otherView)
```

**Cool하다!**

## 제약조건 수정 (Modifying Constraints)

### 제약의 상수 업데이트 (Updating a constraints constant)

가로로 회전할 때 UI의 일부를 수정하여 좀더 적합하게 개선시켜보자

정확히는 가로 화면시에 타이머 레이블의 높이와 글꼴 크기를 더 크게 키워보자

기기가 가로, 세로일 때 각각 높이의 제약조건을 업데이트 해야한다.

이처럼 **상수만을 업데이트** 할 경우 Snapkit은 `updateConstraints(_:)`메서드를 지원한다.

```swift
// MARK: - Orientation Transition Handling
extension QuizViewController {
    override func willTransition(
    to newCollection: UITraitCollection,
    with coordinator: UIViewControllerTransitionCoordinator
    ) {
        super.willTransition(to: newCollection, with: coordinator)
        // 1
        let isPortrait = UIDevice.current.orientation.isPortrait
        
        // 2
        lblTimer.snp.updateConstraints { make in
            make.height.equalTo(isPortrait ? 45 : 65)
        }
        
        // 3
        lblTimer.font = UIFont.systemFont(ofSize: isPortrait ? 20 : 32, weight: .light)
    }
}
```

코드가 하는일은 다음과 같다

1. 디바이스의 현재 `orientation`을 얻는다
2. `lblTimer`의 제약조건을 세로일 때 45, 가로일때 65로 업데이트 한다
3. 폰트의 크기 또한 세로일 때 20, 가로일 때 32로 업데이트한다

매우 간단하게 업데이트 할 수 있다!

### 재작성 (Remake constraints)

상수만 변경하는 것이 아닌 **UI의 전체적인 조건 자체를 변경해야 하는 상황**이 있을 수 있다.

이 때에는 `remakeConstraints(_:)`를 사용한다.

```swift
func updateProgress(to progress: Double) {
    viewProgress.snp.remakeConstraints { make in
        make.top.equalTo(view.safeAreaLayoutGuide)
        make.width.equalToSuperview().multipliedBy(progress)
        make.height.equalTo(32)
        make.leading.equalToSuperview()
    }
}
```

`remakeConstraints`는 **호출이 될 때마다 해당 뷰의 전체 제약조건을 블록내의 제약조건으로 모두 대체**한다.

### 참조 저장(Keeping a Reference)

표준 `NSLayoutConstraints` 방식으로 제약조건에 대한 참조를 저장하고

추후 원하는 시점에 수정을 할 수 있다.

```swift
var topConstraint: Constraint?

lblTimer.snp.makeConstraints { make in 
    // Store your constraint
    self.topConstraint = make.top.equalToSuperview().inset(16)
    make.leading.trailing.bottom.equalToSuperView()
}

// Which you can later modify
self.topConstraint?.update(inset: 32)

// Or entirely deactivate
self.topConstraint?.deactivate()
```

## 클론 코딩(Clone Coding)

`NSLayoutConstaraint` 방식으로 작성한 전화 UI를 Snapkit을 사용하여 구현

[[NSLayoutConstraint 관련 포스트](https://sweetfood-dev.github.io/ios/2-autolayout_code/)]

[[Snapkit 적용 프로젝트]](https://github.com/sweetfood-dev/CloneCoding/tree/main/SnapkitTutorial/SnapkitTutorial)
