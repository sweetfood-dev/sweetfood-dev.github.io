---
title: "[Swift] Protocol Expert - 3"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Protocol
- Synthesized protocol conformance
- Where
- Existentials type
toc: true
toc_sticky: true
toc_label: 목차
---

## Protocols and the type system

좋은 시스템의 지원을 받을 때 프로토콜은 그 진가가 나타나며 Swift가 그 예이다.

이번 포스트에서는 프로토콜 타입이 무엇인지, 프로토콜 타입을 효과적으로 사용하는 법에 대해 

학습한다.

### Existentials

이전에 변수의 타입을 프로토콜로 정의한 적이 있다

```swift
let greeter: Greetable = GermanGreeter()
```

항상 변수를 정의하는 방식이기에 새롭지 않게 느낄수 있다.

하지만 `Int`, `String`같은 일반적인 타입을 사용하는 것과 프로토콜을 타입으로 사용하는 것에는

큰 차이가 존재한다.

`greeter: Greetable`은 일반적인 타입으로 보이겠지만

프로토콜 타입은 **existential 타입**이라고 하는 특수한 타입이다.

existential이라는 이름이 화려해보이고 고급져 보이지만 그다지 복잡한 개념은 아니다

exsitential 타입을 간단하게 설명하자면 구체적인 타입에 대한 **자리표시자(placeholder)**로 생각할 수 있다.

컴파일러는 exsitential 타입에 대해 단지 **특정 프로토콜을 준수하는 타입이라고 해석하고 이해한다.**

위 코드를 예로들면 `greeter`는 `Greetable`을 준수하는 타입의 변수이며 `Greetable`을 준수하는 타입이라면

`GermanGreeter`, `EnglishGreeter`, `KoreanGreeter`등 어떤 타입이라도 할당할 수 있다.

existential 타입은 변수 뿐만 아니라 메소드의 파라미터, 배열의 Element, 기타 data 구조체에 프로토콜을

타입으로 사용할 수 있도록 한다.

### 프로토콜을 타입으로 사용 (Using protocols as types)

다음은 프로토콜을 타입으로 사용하는 예이다.

```swift
func greet(with greeter: Greetable){ ... }
let englishGreeter: Greetable = EnglishGreeter()
let allGreeter:[Greetable] = [germanGreeter, englishGreeter]
```

 

프로토콜을 타입으로 사용할 때 유용한 방법들이 많이 존재한다.

예를 들어 `&` 연산자를 사용해 여러 타입을 단일 타입으로 취급하도록 구성할 수 있다.

```swift
func localizedGreet(with greeter: Greetable & Localizable)
```

`greeter` 파라미터는 프로토콜 `Greetable`과 `Localizable`을 모두 준수하는 타입이어야 전달 받을 수 있다

지금 예시는 `프로토콜 타입 & 프로토콜 타입`이지만 

`구조체 타입 & 프로토콜 타입`(`Date & Codable`)

`클래스 타입 & 프로토콜 타입`(`UITableviewCell & Selectable`)의 구성도 가능하다

2개의 타입을 단일 타입으로 취급하였지만, 그 이상의 타입들로도 구성할 수 있다.

이런식으로 구성하는 타입(non-nominal types라고도 함)은 위 파라미터 변수와 같이 **변수의 타입으로만 사용이 가능하다**

예를 들어

```swift
extension UIViewController: Greetable & Localizable
```

이런식으로 사용할 수는 없다.

하지만 다른방식으로 비슷한 효과를 낼 수 있다.

프로토콜을 준수하는 클래스와 그클래스의 서브클래스를 대상으로하는 확장을 정의할 수 있다

```swift
extension UITableviewDelegate where Self: UIViewController {
    func showAlertForSelectedCell(at index: UIIndexPath) {}
}
```

이런식으로 확장을 정의하면 `UITableViewDelegate` 프로토콜을 준수하는 `UIViewController`와

그 하위클래스에 대해서만 자동으로 `showAlertForSelectedCell(at:)` 메소드를 사용할 수 있도록 확장을 한다.

즉 어떤 타입이 `UITableviewDelegate & UIViewController`을 만족하는 경우 인셈이다

```swift
let hasTableViewViewController: UITableviewDelegate & UIViewController = ...()
let generalViewController: UIViewController = ...()
hasTableViewViewController.showAlertForSelectedCell(at: someIndexPath)
generalViewController.showAlertForSelectedCell(at: someIndexPath)
```

이 코드에서 `generalViewController`의 `showAlertForSelectedCell(at:)`메서드를 

호출하는 라인은 컴파일러가 에러를 노출시킬 것이다.

또한 제네릭 파라미터가 특정 프로토콜을 준수할때만 제네릭 타입을 확장할 수 있도록 정의할 수 있다.

```swift
extension Array where Element: Greetable {
    var allGreeting: String { self.map { $0.greet().joined }
}
```

이 코드는 `Array`의 **제네릭 파라미터** `Element`가 `Greetable` 프로토콜을 준수하는 타입일 때 

`Array`를 확장하여 `allGreeting` 연산프로퍼티를 사용할 수 있도록 한다

위 사례와 유사하게 제네릭 파라미터가 특정 프로토콜을 준수할 때만 제네릭 타입에 프로토콜을 추가하도록 할 수 있다.

```swift
extension Array: Localizable where Elemnt: Localizable {
    static var supportedLanguages: [Language] {
        Element.supportedLanguages
    }	
}
```

`Array`의 제네릭 파라미터 `Element`의 타입이 `Localizable`을 준수하는 타입일 때

`Array`에 대해 `Localizable` 프로토콜을 추가하도록 확장하는 코드이다.

```swift
실제 Array의 extension을 살펴보면
extension Array: Equatable where Element: Equatable
같은 코드를 볼 수 있다.
이는 Element가 Equtable을 준수하는 타입일 때 Array 또한 Equatable 프로토콜을 채택하여 
Equatable의 요구사항을 제공한다
```

## 합성된 프로토콜 적합성(Synthesized protocol conformance)

Swift를 사용하다보면 `Codable` 같은 몇몇 프로토콜을 채택하면 구현을 하지 않아도

프로토콜의 기능을 사용할 수 있는 상황이 있을것이다.

이런 상황은 스위프트가 프로토콜 구현을 합성하여 생성하기 때문에 발생한다.

Swift는 `Equatable`, `Hashable`, `Comparable` 그리고 `Codable`의 종류인

`Encodable`, `Encodable`에 대해 이러한 합성된 프로토콜 구현을 수행한다.

```swift
위의 프로토콜 리스트중 Hashable, Equatable 같은 몇몇 프로토콜은 
클래스 타입에서는 합성된 프로토콜 구현을 수행하지 않기 떄문에 직접 요구사항에 대해 
구현을 해줘야한다.
```

유의할 점으로 **프로퍼티들의 타입이 해당 프로토콜을 준수**해야 Synthesized protocol conformance을 제공 받을 수 있는 제한사항이 있다.
