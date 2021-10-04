---
title: "[Swift] Type & Mutation - 2"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
toc: true
toc_sticky: true
toc_label: 목차
---
## Defining a Point

[이전 포스트](https://sweetfood-dev.github.io/swift/TypeMutation1/)를 참고하여 감안할 때 `Point`는 구조체가 적당한걸로 판단되어짐

구조체로 타입을 정하고 아래의 코드를 작성

```swift
struct Point: Equatable {
    var x, y: Double
}
struct Size: Equatable {
    var width, height: Double
}
struct Rectangle: Equtable {
    var origin: Point
    var size: Size
}
```

## 함수와 메서드 (Function And Methods)

위의 코드에서 `Point`, `Size`, `Rectangle` 타입 모두 저장 프로퍼티만 존재함

몇 가지 메소드를 추가해보자

```swift
extension Point {
    func flipped() -> Self {
        Point(x: self.y, y: self.x)
    }
    mutating func flip() {
        let temp = self
        self.x = temp.y
        self.y = temp.x
    }
}
```

`flipped()`와 `flip()` 모두 `x`, `y` 값을 교환하는 메소드이다. 

차이점은 2가지가 있다

1. `flipped()`는 `Self`를 반환하는 메서드 `flip()`은 반환하지 않는 메서드
2. `flipped()`는 `self`를 참조로서만 사용하지만
`flip()`은 참조도 하고 수정으로도 사용한다. 수정하기 때문에 `mutating` 키워드가 붙음

위 코드를 좀 더 이쁘게 수정할 수 있다

```swift
func flipped() -> Self {
    Point(x: y, y: x)
}

mutating func flip() {
    self = flipped()
}
```

불필요한 `self`의 참조가 사라지고

실제 `x`, `y`가 교환되는 메서드는 `flipped()`에서만 행해 진다

### Mutating and Self

Swift 컴파일러는 타입 메서드를 사용하여 `self: Self`를 보이지 않는 파라미터로 전달한다.

> `self`는 자신의 **인스턴스를 참조**하는 키워드이고 `Self`는 **자신의 타입**이다.
> 

`mutating` 메서드를 사용하면 Swift는 보이지 않는 `self: inout Self`를 전달한다

`inout` 키워드는 함수에 들어갈 때와 종료할 때 각각 복사본을 만든다

### Static method 와 Static Property

정적 메서드와, 정적 프로퍼티도 추가해보자

```swift
extension Point {
    static var zero: Point {
        Point(x:0, y:0)
    }
    static func random(inRadius radius: Double) -> Point {
        guard radius >= 0 else { return .zero }
        let x = Double.random(-radius ... radius)
        let maxY = (radius * radius - x * x).squareRoot()
        let y = Double.random(-maxY ... maxY)
        return Point(x: x, y: y)
    }
}
```

### 열거형 (Enumerations)

Swift의 열거형은 유한한 상태의 집합을 모델링할 수 있는 강력한 값 타입이다

```swift
enum Quadrant: CaseIterable, Hashable {
    case i, ii, iii, iv
	
    init?(_ point: Point) {
        guard !point.x.isZero && !point.y.isZero else { return nil }

        switch (point.x.sign, point.y.sign) {
        case (.plus, .plus):
            self = .i
        case (.minus, .plus):
            self = .ii
        case (.minus, .minus):
            self = .iii
        case (.plus, .minus):
            self = .iv		
        }
    }
}
```

이 열거형은 사분면에 대한 추상화를 만듬

`CaseIterable`을 통해 `allCase` 배열에 접근이 가능하고

`Hashable`을 통해 `Set`의 `Element`로 사용이 가능하거나 `Dictionary`의 `key`로 사용이 가능하다

옵셔널 이니셜라이저를 사용하면 사분면에 없는 경우는 실패 가능하게 만들 수 있다.

```swift
Quadrant(Point(x: 10, y: -3)) // .iv
Quadrant(.zero) // nil
```

### 연관 값 (Associated Values)

Swift의 열거형은 특정 사례와 연관시킬 수 있기 때문에 매우 강력하다

다음 코드를 보자 

```swift
enum Shape {
    case point(point: Point)
    case segment(start: Point, end: Point)
    case circle(center: Point, radius: Double)
    case rectangle(Rectangle)
}
```

```swift
let pointShape = Shape.rectangle(rect: Rectangle(origin: .zero, size: Size(width: 50, height: 50)))

switch pointShape {
case .point(let point):
    print(point)
case .segment(start: let sPoint, end: let ePoint):
    print("start : \(sPoint) end: \(ePoint)")
case .circle(center: let center, radius: let radius):
    print("circle center \(center) radius\(radius)")
case .rectangle(rect: let rect):
    print("rectangle \(rect.origin) \(rect.size)")
}
```

## 정리

이번 포스트 까지 `Class`, `Struct`, `Method`, `Enum` 등에 대해 복습함

다음 포스트엔 `Protocol`, `Generic`에 대해 다시 복습
