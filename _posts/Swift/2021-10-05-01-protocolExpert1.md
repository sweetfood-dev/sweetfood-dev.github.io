---
title: "[Swift] Protocol Expert - 1"
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
toc: true
toc_sticky: true
toc_label: 목차
---

Swift를 사용하면 한번쯤은 프로토콜을 사용해 봤을것이다.

프로토콜과 POP는 Swift의 DNA에 새겨져있으며 프로토콜의 강력함이 없다면

지금의 Swift와는 다른 형태로 개발을 하고 있지 않을까?

그만큼 프로토콜은 Swift에서 중요한 부분이기 때문에 

이번 포스트에서는 프로토콜에 대해 다시한번 복습하고자 한다

- 프로토콜의 작동방식
- 프로토콜을 활용하여 오래 지속되며 리팩토링이 쉬운 API를 생성
- 프로토콜을 사용하는 일반적인 패턴
- 프로토콜을 사용할 때 염두해야할 몇 가지 문제

이 4가지를 작은 RESTful 라이브러리를 구축하며 깊게 학습할 생각이다.

최종적으로는 raywenderlich의 article을 표시하는 앱을 완성시키는 것

먼저 프로토콜에 대해 간략히 알아보자

## Protocol 시작하기 (Getting started with Protocol)

다음과 같은 코드가 있다고 생각해보자

```swift
counter.increment(by: 10)
```

**`counter`**는 `**increment(by:)`** 메서드를 가지고 있는 `**Counter**` 타입의 인스턴스라고 가정해보자

컴파일러는 `**counter**`의 타입이 `**Counter**`임을 알고 있고 `**Counter**` 타입에 일치하는 메서드를 찾을 수 있기 때문에 `**increment(by:)**` 메서드가 존재하는지 알고 있다

그러나 간혹, 혹은 자주 개발자와 컴파일러가 어떤 타입을 사용할 지 정확히 모르는 상황도 발생한다.

예를 들어 **`Counter`**, **`DoubleCounter`**, **`UserCounter`** 타입이 있을 때 증가시킬 수 있는 공통의 단 하나의 함수를 정의하려면 어떻게 해야 할까?

다음을 고려해보자 

```swift
func incrementCounter(_ counters: [?]) {
    for counter in counters {
        counter.increment(by: 1)
    }
}
```

이 코드가 위에서 설명한 문제이다. **`[?]`**에 어떤 타입이 들어가야할까?

**`[Counter]`** 타입을 사용하면 **`DoubleCounter`**, **`UserCounter`** 같은 다른 타입은 사용할 수 없다.

**`[Any]`** 타입을 사용하면 모든 타입을 사용할 수 있지만, **`Any`** 타입이 **`increment(by:)`** 메서드를 가지고 있다고 **확신할 수 없다.**

그렇다면 정리를 해보자.

> 우리가 필요한 것은 **`increment(by:)`** 메소드가 있다고 확신할 수 있어야 하고, 
이 확신이 드는 타입을 인자로 받아 들이겠다.
> 

이 문장이 바로 프로토콜이 필요한 지점이다.

```swift
protocol Incrementable {
    func increment(by: Int)
}
```

이 프로토콜을 채택 하면 **`Incrementable`**을 채택한 타입은 필수적으로 **`increment(by:)`** 메서드를

구현해야 한다. 

타입으로 **`Incrementable`**을 사용한다면 **`increment(by:)`** 메서드가 있는 타입이라는 것을 확신할 수 있으므로 아래와 같은 함수를 정의할 수 있다.

```swift
func incrementCounter(_ counters: [Incrementable]) {
    for counter in counters {
        counter.increment(by:1)
    }
}
```

### 프로토콜 문법 (Protocol syntax)

간단한 열거형과 프로토콜을 정의하는 것을 시작으로 문법에 대해 간략히 복습해 보자 

```swift
enum Language {
    case english, german, croatian
}
protocol Localizable {
    static var supportedLanguage: [Language] { get }
}

protocol ImmutableLocalizable: Localizable {
    func changed(to language: Language) -> Self
}

protocol MutableLocalizable: Localizable {
    mutating func change(to language: Language)
}
```

**`Localizable`** 프로토콜은 **`getter`**를 요구하는 **`static`** 프로퍼티를 지원한다.

즉 **`get`**만 지원하는 연산프로퍼티, 혹은 저장 프로퍼티로 사용하여도 만족한다는 의미이다.

**`get`**은 **최소 요구조건**이지 무조건 **`getter`**만 지원해야 한다는 의미가 아니다.

**`static`** 키워드로 선언되었기 때문에 구현하는 타입에서는 **`static`** 프로퍼티로 구현해야 한다

**`ImmutableLocalizable`**, **`MutableLocalizable`** 프로토콜은 모두 **`Localizable`**을 상속받는 프로토콜이다.

이들 프로토콜을 구현하는 타입은 각각 요구조건인 **`changed(to:)`**, **`change(to:)`**와 더불어 **`Localizable`**의 요구조건인 **`supportedLanguage`** 프로퍼티도 구현해야 한다는 의미가 있다.

```
extension UILabel: MutableLocalizable {
    static let supportedLanguages: [Language] = [.english, .german]

    func change(to language: Language) {
        switch language {
        case .english: text = "Help"
        case .german: text = "Hilfe"
        case .croatian: text = "Pomoć"
        }
    }
}

```

**`changed(to:)`** 현재 타입인 **`Self`**를 반환한다.

예를 들어 **`FeedView`** 타입에서 **`changed(to:)`**를 구현하면 반환되는 타입은 **`FeedView`** 타입이다

**`change(to:)`**는 반환 타입이 없고 **`mutating`** 키워드가 존재한다. 자신의 인스턴스의 값을

수정하는 메소드라는 것을 알 수 있다.

구조체, 열거형 타입에서 구현할 때는 **`mutating`** 키워드가 필요하지만, 클래스 타입에서 구현할 때는

클래스는 기본적으로 변경 가능한 타입이기에 **`mutating`** 키워드는 생략할 수 있다. 

선언을 알아보았으니 실제 프로토콜을 채택하여 구현을 해보자 

```swift
struct Text: ImmutableLocalizable {
    static let supportedLanguages: [Language] = [.english, .croatian]  
    var content = "Help"
    
    func changed(to language: Language) -> Self {
        let newContent: String
        switch language {
        case .english: newContent = "Help"
        case .german: newContent = "Hilfe"
        case .croatian: newContent = "Pomoć"
        }
    return Text(content: newContent)
    }
}
```

타입에 직접 채택하는 것이 아닌

**`extension`**을 사용하여 채택할 수도 있다

```swift
extension UILabel: MutableLocalizable {
    static let supportedLanguages: [Language] = [.english, .german]
    
    func change(to language: Language) {
        switch language {
        case .english: text = "Help"
        case .german: text = "Hilfe"
        case .croatian: text = "Pomoć"
        }
    }
}
```

### 프로토콜의 확장 (Extension Protocols)

프로토콜을 확장하여 프로토콜의 멤버 ( 메소드, 프로퍼티등 )의 **기본 구현을 제공**할 수 있다

```swift
extension Localizable {
    static var supportedLanguages: [Language] {
        return [.english]
    }
}

struct Image: Localizable {
    // no need to add `supportedLanguages` here
}
```

프로토콜을 준수하는 타입에서 기본 구현이 제공되는 요구사항을 구현하지 않는 다면

자동으로 기본구현이 사용된다.

지금 까지의 코드들은 모든 타입에서 채택이 가능한 프로토콜이였지만

클래스에서만 채택할 수 있도록 제한 조건을 설정할 수 있다.

```swift
protocol UIKitLocalizable: AnyObject, Localizable {
    func change(to language: Language)
}
```

이 때 클래스가 암시적으로 채택하는 **`AnyObject`** 프로토콜을 사용하면 클래스에서만 채택할 수 있는

프로토콜을 선언할 수 있다

특정클래스의 하위클래스만 채택할 수 있도록 제한할 수도 있다.

```swift
protocol LocalizableViewController where Self: UIViewController {
    func showLocalizedAlert(text: String)
}
```

**`LocalizableViewController`** 프로토콜은 **`UIViewController`** 타입이나 그 하위 타입만 채택할 수 있는

프로토콜이다.
