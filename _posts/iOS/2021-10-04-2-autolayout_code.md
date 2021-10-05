---
title: "[iOS] Autolayout - 코드로 작성하기"
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
toc: true
toc_sticky: true
toc_label: 목차
---
# Autolayout - 코드로 작성하기

스토리보드로 작업을 하면 편리하지만 관리하는 Controller의 갯수가 늘어날수록,

View의 수가 늘어날수록 무거워지고 느려지는 단점이 있다.

또한 다른 개발자와 협업 시 Git과 같은 형상관리도구를 많이 사용하는데 변경점이 무엇인지

이해하기 힘든 부분이 많이 있다고 한다.

따라서 현업에서는 보통 코드를 베이스로 많이 작업을 한다고 하기 때문에

코드로 Autolayout을 적용하는 법을 알아보고자 한다.

어렵게 생각하지 말자. 스토리보드로 하던 과정을 똑같이 코드로 옮기면 된다!

보통 스토리보드로 UI를 구성할 때 아래와 같은 과정을 거친다

1. 버튼, 뷰등 추가할 컴포넌트를 다른 View안에 추가한다.
2. 컴포넌트의 배경색, 타이틀 문구등을 설정
3. 컴포넌트의 위치, 크기등을 설정

2번과 3번의 과정은 개발자마다 다르지만 보통 크게 보면 위와 같은 작업을 거친다. 

이 과정을 똑같이 코드로 옮겨 보자

## 컴포넌트 추가

코드로 autolayout을 적용하기 위해서 제일 먼저 해야할 작업은

view의 translatesAutoresizingMaskIntoConstraints 프로퍼티를 false로 해두고 작업을 해야한다.

```swift
let myFisrtView = UiView()
// 필수
myFirstView.translatesAutoresizingMaskIntoConstraints = false
```

그리고 상위 뷰에 넣어주자.

이번 코드에서는 ViewController의 rootView에 넣어줌

```swift
view.addSubview(myFirstView)
```

## 컴포넌트 자체 설정

```swift
myFirstView.backgroundColor = .systemPink
myFistView.layer.cornerRadius = 20
```

## 위치, 크기등 Constraint 설정

Autolayout은 2가지만 명심하면 된다.

위치를 잡아줘야하고, 크기를 설정해야한다.

이런 위치와 크기를 우리는 Anchor로 설정할 수 있음

### 위치 Anchor

topAnchor : 위 

bottomAnchor : 아래

leadingAnchor : 왼쪽

trailingAnchor : 오른쪽

centerXAnchor : 중앙 X

centerYAnchor : 중앙 Y

leftAnchor : 왼쪽

rightAnchor : 오른쪽

> leading, trailing Anchor와 left, rightAnchor가 각각 왼쪽, 오른쪽으로 같지만
몇몇 국가에서는 화면을 왼쪽에서 오른쪽으로 보는것이 아닌 오른쪽에서 왼쪽으로 보게 되는데
leading, trailing Anchor의 경우 이러한 국가에서는 좌우가 바뀐다고 함.
left,right는 바뀌지 않고 유지된다고 함
> 

### 크기 Anchor

widthAnchor : 길이

heightAnchor : 높이

설정할 Anchor를 기입하였다면 constraint 메서드로 설정하면 된다.

constraint 메서드는 여러 오버라이드가 존재함

```swift
constraint(equalTo:constant:)
constraint(equalTo:multiplier:)
constraint(equalToConstant:)
```

대표적으로 3가지가 있으며 equalTo 대신에 greaterThanOrEqualTo, lessThanOrEqualTo 같은 인자레이블이 있는 오버라이드들이 존재함.

그리고 constraint를 설정하였다면 .isActive 프로퍼티에 true를 설정해야 오토레이아웃에 적용이 된다.

## 예제코드

```swift
// 0. View 생성
let myFirstView = UIView()
// 코드로 작업시에는 필수로 설정
myFirstView.translatesAutoresizingMaskIntoConstraints = false
// 1. 상위 뷰에 넣어준다
view.addSubview(myFirstView)
// 2. View 자체 프로퍼티를 설정
myFirstView.backgroundColor = .systemPink
myFirstView.layer.cornerRadius = 20
// 3-1. 위치를 잡고
myFirstView.topAnchor.constraint(equalTo: view.topAnchor, constant: 18).isActive = true
myFirstView.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
// 3-2. 사이즈를 설정
myFirstView.widthAnchor.constraint(equalToConstant: 200).isActive = true
myFirstView.heightAnchor.constraint(equalToConstant: 200).isActive = true
```

기본적인 설정은 클로저 변수를 사용할 수 도 있다

```swift
let mySecondView: UIView = {
    let view = UIView()
    view.backgroundColor = #colorLiteral(red: 0.3411764801, green: 0.6235294342, blue: 0.1686274558, alpha: 1)
    view.layer.cornerRadius = 30
    view.translatesAutoresizingMaskIntoConstraints = false
    view.clipsToBounds = true
    return view
}()
override func viewDidLoad() {
    ...
    view.addSubview(mySecondView)
    mySecondView.widthAnchor.constraint(equalTo: myFirstView.widthAnchor, multiplier: 0.5).isActive = true
    mySecondView.heightAnchor.constraint(equalToConstant: 100).isActive = true
    mySecondView.leadingAnchor.constraint(equalTo: myFirstView.leadingAnchor, constant: 0).isActive = true
    mySecondView.topAnchor.constraint(equalTo: myFirstView.bottomAnchor, constant: 20).isActive = true
}
```

각 앵커 설정마다 isActive 프로퍼티를 설정하는 대신 

NSLayoutConstraint의 클래스 메서드

class func activate(_ constraints: [NSLayoutConstraint])를 사용할 수 있다.

```swift
let myThirdView: UIView = {
    print("ThirdView Create")
    let view = UIView()
    view.backgroundColor = #colorLiteral(red: 0.9568627477, green: 0.6588235497, blue: 0.5450980663, alpha: 1)
    view.translatesAutoresizingMaskIntoConstraints = false
    view.clipsToBounds = true
    return view
}()

override func viewDidLoad() {
    ...
    view.addSubview(myThirdView)
    NSLayoutConstraint.activate([
        myThirdView.topAnchor.constraint(equalTo: mySecondView.topAnchor),
        myThirdView.leftAnchor.constraint(equalTo: mySecondView.trailingAnchor, constant: 10),
        myThirdView.widthAnchor.constraint(equalTo: mySecondView.widthAnchor),
        myThirdView.heightAnchor.constraint(equalTo: mySecondView.heightAnchor)
    ])
}
```

### 결과

[[전체코드]](https://github.com/sweetfood-dev/CloneCoding/tree/main/AutolayoutCodeVersion/AutolayoutCode)

![스크린샷 2021-10-04 오후 11.11.00.png](/assets/images/Posts/iOS/2021-10-04-autolayout/autolayout_code_result.png)


## 클론 코딩

스토리보드를 사용하여 오토레이아웃을 적용한 [이 포스트에서](https://sweetfood-dev.github.io/ios/1-autolayout/#stackview) 만든 프로젝트를

이번에는 코드를 사용하여 완성

[[전체 코드]](https://github.com/sweetfood-dev/CloneCoding/tree/main/PhoneCallCodeLayout/PhoneCallCodeLayout)

![스크린샷 2021-10-05 오후 9.05.14.png](/assets/images/Posts/iOS/2021-10-04-autolayout/cloneCodingResult.png)

### 오답 노트

1. UIStackView에 코드로 서브뷰를 추가할 때는
    
    `addSubview(_:)`가 아닌 `addArrangedSubview(_:)` 를 사용해야 한다.
    

> 정렬이 안되서 한참을 해멤
> 
1. 컨스트레인트의 기준?

```swift
NSLayoutConstraint.activate([
phoneLabel.bottomAnchor.constraint(equalTo: totalStackView.topAnchor, constant: -30),
phoneLabel.leadingAnchor.constraint(equalTo: totalStackView.leadingAnchor),
phoneLabel.trailingAnchor.constraint(equalTo: totalStackView.trailingAnchor),
])
```

초기에는 `phoneLabel`에서 `bottomAnchor`를 `totalStackView`의 `topAnchor`에서 30만큼을 주었는데 

오히려 붙는 현상이 발생

혹시나? 해서 -30 값을 주었더니 원하는 위치에 정렬됨.

아마 기준이 되는 `Anchor`가 `constraint`를 호출하는 `phoneLabel.bottomAnchor`이어서 그런 것 같음
