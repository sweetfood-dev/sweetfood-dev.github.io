---
title: "[Swift] Protocol Expert - 2"
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
- Static Dispatch
- Dynamic Dispatch
toc: true
toc_sticky: true
toc_label: 목차
---

표면적인 프로토콜의 수준을 아는것만으로도 사용하기에는 충분하다

하지만 프로토콜의 Edge case와 성능 골려를 최대한 이해하기 위해서는

Swift의 내부 동작을 더 깊이 아는 것이 도움이 된다.

## 정적 & 동적 Dispatch (Static and dynamic dispatch)

구체적으로 함수가 호출될 때 어떤일이 발생하는지 이해해야 한다.

한 곳에서 함수를 선언하면 다른곳에서 함수는 어떻게든 실행이 된다

이는 런타임에 Swift가 함수의 이름을 찾아 해당 함수의 주소로 점프하여 코드를 

실행하기 때문에 가능한 것이다.

하지만 함수의 주소로 이동하는 것이 항상 간단한 것은 아니다

함수를 저장하고 호출하는데 2가지 주요 메커니즘이 있다.

이번 소제목인 정적 dispatch와 동적 dispatch가 바로 이 주요 메커니즘이다.

**정적 디스패치**는 **함수가 절대 변경되지 않는 것이 확실할 때** 사용된다

변경되지 않는 다는 것은 같은 이름의 함수가 여기저기 있다는 것
메서드 재정의(`override`)가 그 예이다

주로 `final` **클래스**와 **전역 함수**, **구조체에서 선언된 메서드**에서 사용된다.

이 경우에는 걱정해야할 메서드의 재정의가 없어 컴파일러는 함수의 주소를 하드코드하고

함수가 호출(참조)될 때 해당 함수의 주소로 이동할 수 있다.

상속과 프로토콜을 추가하면 조금 더 까다로워지고 복잡해진다

`final`이 아닌 클래스 인스턴스에서 호출되는 메서드는 여러위치에서 선언될 수 있다

인스턴스의 `클래스`, 그 상위 `클래스`, 혹은 `extension`에

또는 `protocol extension` 같은 곳에 선언되어질 수도 있다.

이런 점은 컴파일러가 **함수의 정확한 주소**를 미리 알 수 없게 만드는 요인이다.

> 미리 알 수 없다는건 컴파일 단계에서 알 수 없다는 의미 같다
> 

이런 경우 witness table을 사용한다.

(v-table, virtual table이라 불리기도 하지만, 감시 테이블이라고 사용하겠다)

![witnessTable.png](/assets/images/Posts/Swift/2021-10-06/witnessTable.png)

컴파일러는 코드를 진행하면서 각 클래스에 대한 테이블을 생성한다.

위 그림의 각 `Company` 와 `Apple` 클래스에 대한 테이블이라고 생각하자

테이블에는 열이 2개가 존재한다. 하나는 테이블의 **오프셋에 대한 열**이며

다른 하나는 해당 오프셋에 있는 **함수에 대한 열**이다.

> 오프셋은 아마도 함수의 위치가 있는 주소인 것 같다, 위 그림에서는 오프셋 열이 생략
> 

클래스의 각 메서드는 작업 메모리에 저장되어진 이 테이블에 저장된다.

서브 클래스의 경우는

1. 부모의 테이블을 복사하고
2. `override` 하는 메서드를 대체 한다.

위 그림으로 하면 `Company`의 서브 클래스인 `Apple`은 부모(`Company`)의 테이블을 복사하여 `calculateNewWorth()`와 `getCEOName()`이 존재하는 것을 볼 수 있다.

`getCEOName()`의 경우 `override`를 하였기 때문에 부모의 `getCEOName()`메서드를 대체하였고 

그 의미로 배경색이 녹색이 되어진 것이다.

또한 자신의 메소드 `makeNewIphone()`을 추가를 하여 `Apple`의 테이블이 완성되었다.

이러한 단계를 걸쳐 테이블이 만들어지며 Swift는 런타임 단계에서 이 완성된 테이블을 사용할 수 있다.

메서드가 호출(참조)되면 Swift는 테이블에서 해당 메서드의 오프셋을 알 수 있다.

이러한 방식이 동적 디스패치이며 동적 디스패치를 사용하여

상속, 다형성, 프로토콜 등을 허용하고 동일한 이름을 가진 메소드의 구현의 동적 변경을 허용할 수 있다.

물론 이러한 기능에는 비용이 따른다.

단순히 생각해봐도 테이블을 만드는 비용이 추가 되는 상황이니 말이다.

테이블 행에서 함수를 호출하면 각 함수 호출에 대해 일정한 오버헤드가 추가되기 때문에

동적 디스패치가 정적 디스패치보다 속도면에서 느리게 만든다.

### Dispatch in protocols

그렇다면 위의 내용들이 프로토콜과 무슨 관련이 있을까?

위 내용에서 동적 디스패치를 사용해야 상속같은 기능을 사용할 때 함수의 위치를 동적으로 찾을 수 있다고

언급하였다.

우리는 프로토콜 또한 상속을 지원하는 것을 알고 있다. 

그 외에도 여러 클래스와 구조체가 동일한 프로토콜을 채택하고 채택한 프로토콜의 메서드를 구현할 수 있다.

그렇다면 동일한 메서드가 여러 타입에서 만들어 지는 것과 같다.

이전 포스트의 예제 코드에서 아래와 같은 코드를 보자

```swift
protocol Localizable {
    static var supportedLanguages: [Language] { get }
}

protocol ImmutableLocalizable: Localizable {
    func changed(to language: Language) -> Self
}

protocol MutableLocalizable: Localizable {
    mutating func change(to language: Language)
}
```

이러한 프로토콜들이 있을 때

```swift
struct Text: ImmutableLocalizable {
    static var supportedLanguages: [Language] =  [.english, .croatian]
    var content = "Help"
    func changed(to language: Language) -> Self {
        let newContent: String
        switch language {
        case .english: newContent = "Help"
        case .german: newContent = "Hilfe"
        case .croatian: newContent = "pomoc"
        }
        
        return Text(content: newContent)
    }
}

extension UILabel: MutableLocalizable {
    static var supportedLanguages: [Language] = [.english, .german]
    func change(to language: Language) {
        switch language {
        case .english: text = "Hello"
        case .german: text = "Hilfe"
        case .croatian: text = "pomoc"
        }
    }
}
```

이렇게 해당 프로토콜을 채택하여 구현한 구조체 `Text`와 `UILabel`이 있다.

그리고 아래의 함수가 있다고 생각해보자

```swift
func supportedLanguageInfo(at target: Localizable) {
	print(target.supportedLanguages.rawValue)
}
```

이 경우 `Swift`는 `target`으로 전달된 `Localizable` 타입의 인스턴스가

`UILabel`의 인스턴스인지, `Text`의 인스턴스인지 미리 알 수가 없다.

이 말은 어떤 타입의 `supportedLanguages`를 호출 해야하는지 알 수 없다는 의미다

따라서 동적으로 호출해야할 메서드를 전달해야 한다.

Dispatching 프로토콜 메소드는 클래스가 작동하는 방식과 유사하다

프로토콜을 구현하는 모든 타입은 고유한 "**프로토콜 감시 테이블**"을 갖는다

> 위의 소제목 정적 & 동적 Dispatch에서 설명한 감시 테이블과는 별개의 프로토콜을 위한 감시테이블이다.
> 

이 테이블에도 마찬가지로 메서드가 있는 열, 오프셋이 있는 열이 존재하고

프로토콜의 각 멤버(요구사항으로 선언된 프로퍼티, 메서드)는 테이블에 고유한 행을 갖는다.

이 테이블은 프로토콜을 구현하는 인스턴스와 함께 저장된다

Swift는 런타임에 프로토콜 감시 테이블에서 해당 메서드를 찾아 호출할 수 있다.

클래스 인스턴스를 사용하는 경우에는 클래스의 감시 테이블과 프로토콜 감시 테이블 모두에서 메서드를 조회하여 호출할 메서드를 동적으로 찾을 수 있다.

### Dealing with extension

위의 예까지는 어느정도 이해가 잘 될것이다.

우리는 한가지 기능을 더 생각해봐야 한다. 바로 **확장(extension)**이다.

프로토콜의 요구사항 중 메소드에 대한 기본구현을 위해 프로토콜을 확장할 때

이 확장은 프로토콜 감시 테이블에 저장이 될까?

아니면 인스턴스의 테이블에 저장이 될까?

또한 프로토콜의 요구사항이 아닌 메서드를 확장에 추가하여 기본 구현을 제공하면 어떻게 될까?

정적, 동적 디스패치에 대해 이해하였다면 어느정도 감이 잡힐 것이다.

먼저 기본 구현의 경우를 살펴보자.

```swift
protocol Greetable {
	func greet() -> String
}
extension Greetale {
	func greet() -> String { "Hello" }
}
```

그리고 이 프로토콜을 채택하는 구조체를 정의해보자

```swift
struct GermanGreeter: Greetable {
}
let greeter = GermanGreeter()
print(greeter.greet()) // Hello
```

인스턴스를 생성하고 프로토콜 메소드까지 호출하면 기본 구현에서 제공한 `"Hello"`가 출력된다.

작동하는 방식은 `greet()`의 기본 구현이 프로토콜을 준수하는 타입에 복사되고

그 타입의 프로토콜 감시 테이블에도 추가되는 것이다.

> 프로토콜 자체에는 테이블이 존재하지 않는다. 구체적인 타입에만 테이블이 존재한다
> 

`GermanGreeter`타입에 `greet()`를 직접 구현하고 호출해보자

```swift
struct GermanGreeter: Greetable {
	func greet() -> String { "Hallo" }
}
let greeter = GermanGreeter()
print(greeter.greet()) // Hallo
```

`"Hallo"`가 실행된다.

이는 `GermanGreeter` 안에서 새로 구현된 `greet()` 메서드가

프로토콜 감시 테이블의 확장 메서드의 기본 구현 `greet()`를 대체하였기 때문이다.

이런 상황은 앞서 `Company`와 `Apple`의 예에서도 보았듯이 클래스에서 메소드를 오버라이드할 때도 발생한다

지금까지 예상한대로 흘러왔다.(적어도 내가 한 예상에서는 일치했다)

이제 의외의 것을 만들어보자. 프로토콜 확장에 새 기본 구현 메소드를 추가하자

```swift
extension Greetable {
	func greet() -> String { "Hello" }
	func leave() -> String { "Bye" }
}
```

그리고 코드를 실행해보자

```swift
let greeter = GermanGreeter()
print(greeter.leave()) // "Bye"
```

`leave()`는 프로토콜의 요구사항에는 없지만 확장에서만 추가한 기본구현 메서드이다.

프로토콜을 구현하는 모든 타입은 확장에서만 추가한 메서드에도 접근할 수 있기에

`"Bye"`가 잘 출력된다.

이 메서드 또한 `GermanGreeter`에서 구현하고 사용해 보자

```swift
struct GermanGreeter: Greetable {
	func greet() -> String { "Hallo" }
	func leave() -> String { "Tschuss" }
}
let greeter = GermanGreeter()
print(greeter.leave()) // Tschuss
```

구조체에 추가한 내용이 출력된다.

여기에서 인스턴스 변수 `greeter`의 선언을 조금 바꿔보자

```swift
let greeter: Greetable = GermanGreeter()
print(greeter.greet()) // "Hallo"
print(greeter.leave()) // "Bye"
```

`greet()` 메서드는 `"Hallo"`를 잘 출력하는데 `leave()` 메서드의 출력이 `"Bye"`이다???

Swift는 구조체에서 선언한 `leave()` 메서드를 무시하고 프로토콜의 확장에 선언된

기본 구현 메서드 `leave()`를 호출한 것 같이 보인다.

예상하지 못한 결과지만 천천히 살펴보자

힌트 중 하나는 `Greetable`으로 정의했을 때와 `GermanGreeter`로 정의했을 때 결과가 다른걸 보면

호출된 함수가 변수의 선언된 타입에 의존한다는 것이다

이것은 **다형성이 작동하지 않는다는 것**을 의미한다.

동적 디스패치를 사용하면 다형성이 가능해야 한다고 하였는데 그렇지 않은걸 보면

**동적 디스패치가 아닌 정적 디스패치를 사용했다라는 사실을 유추해볼 수 있다.**

실제로 **extension에만 선언된 메서드**는 **정적 디스패치에 의존**한다.

이는 `leave()`에 관련된 감시 테이블이 없다는 의미이다.

`greet()`도 `extension`에서 기본구현으로 제공이 되지만 `leave()`와 다른점이 있다.

바로 `protocol`의 요구사항으로 존재한다는 것이다. 그렇기 때문에 프로토콜 감시 테이블에

존재하고 동적 디스패치를 활성화 하였기 때문에 예상대로 동작하는 것이다.

> 프로토콜의 요구사항으로 존재한다는 건 프로토콜의 정의,선언에 있다는 뜻
> 

프로토콜의 확장에 메소드를 추가하는 것이 Swift에서는 일반적이기 때문에 이같은 사실은 중요하다.

프로토콜의 확장에 메소드를 추가하는 것은 구조체나 클래스에 재사용이 가능한 함수 / 메소드를 추가하는 좋은 방법이다

그러나 **프로토콜의 extension에서 선언한 메서드를 재정의 하려면 프로토콜의 요구사항으로 존재해야 한다는걸 꼭 명심하자.**

그렇지 않으면 위 코드와 같이 예상치 못한 결과를 경험할 수 있을 것이다.

> 여기서 말하는 재정의는 상속한 경우 부모의 메서드를 재정의하는 것과는 다른 경우인 것같음
프로토콜의 기본 구현을 안쓰고 해당 타입에서 선언해서 쓸 경우를 말하는 것 같음
즉 위의 코드에서 leave()는 Greeter의 확장에만 선언되어 있는 leave()를 재정의 하는게 아닌
그냥 GermanGreeter에서 Greeter 프로토콜과 관련 없는 leave()라는 새로운 메소드를 선언한 것.
재정의가 되기 위해선 Greeter 프로토콜의 요구사항으로 leave() → String이 존재해야한다는 것이 
결론
>
