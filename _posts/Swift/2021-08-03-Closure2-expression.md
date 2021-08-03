---
title: "[Swift] 클로저 표현식(Closure expression) (2)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Closure
toc: true
toc_sticky: true
toc_label: 목차
---

## 클로저 표현식 구문

본격적으로 클로저의 표현식에 대해 알아봅시다.

클로저의 일반형식은 다음과 같습니다

```swift
{ (parameter: parameterType) -> returnType in 
    code....
}
```

 전체적으로 전역함수의 구문과 비슷합니다. 다만 클로저의 선언은 { }의 첫 줄에는 파라미터와 반환 타입을 작성하고 반환 타입 뒤에 in 을 붙입니다.

주의할 점이 있습니다. 클로저는 in-out 파라미터, 가변 파라미터, 또한 튜플타입의 파라미터, 튜플타입의 반환을 사용할 수 있지만 **기본값을 갖는 파라미터**는 사용할 수 없습니다!

이전에 선언했던 backward(_:) 함수를 클로저로 변환해봅시다.

```swift
func backward(_ s1: String, _ s2: String) -> Bool {
    return s1 > s2
}

let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
names.sorted(by: backward) // 함수 사용
// 클로저
names.sorted(by: { (s1: String, s2: String) -> Bool in {
    return s1 > s2
})

// 위의 경우처럼 짧은 경우 한줄로 작성 가능
names.sorted(by: { (s1: String, s2: String) -> Bool in { return s1 > s2 })
```

인라인 클로저의 표현식의 경우 파라미터와 반환 타입은 중괄호 안에, 일반 함수의 경우는 중괄호 외부에 작성하는 차이가 있습니다.

in 키워드는 매개변수 및 반환 타입의 정의가 완료 되었으며 클로저 본문이 시작될 것임을 나타냅니다.

일반 함수를 사용했을 때 함수이름(backward) 부분을 같은 내용을 가지는 클로저로 대체되었을 뿐 결과는 같습니다.

## 타입 추론

클로저의 첫 게시글에서 말했듯이 클로저는 파라미터와 반환 타입에 대해 타입 추론이 가능합니다

Array의 sorted(by:) 메소드에서 인자레이블 by:의 타입은 (String, String) → Bool임을 Swift는 알고 있기 떄문에 해당 매개변수로 들어올 클로저는 (String, String) → Bool 타입이어야 하기때문에 파라미터의 타입과 반환타입을 생략할 수 있습니다!

> 이러한 타입 추론때문인지 Swift는 타입에 매우 엄격합니다!. 대신 이러한 타입추론 덕분에 편한점도 많은 것 같습니다.

파라미터의 타입, 반환타입을 생략할 수 있기때문에 아래와 같은 코드가 가능합니다.

```swift
// 클로저의 원형
names.sorted(by: { (s1: String, s2: String) -> Bool in {
    return s1 > s2
})

// 타입추론으로 인한 코드 생략
names.sorted(by: { s1, s2 in 
    return s1 > s2
})
```

원형과 비교하면 파라미터를 감싸고있는 소괄호 ()와 파라미터의 타입, 반환 화살표 →와 반환타입이 생략되었습니다.

## 암시적 반환

클로저도 단일표현식으로만 이루어져 있다면 return 키워드를 생략할 수 있습니다

```swift
// 클로저의 원형
names.sorted(by: { (s1: String, s2: String) -> Bool in {
    return s1 > s2
})

// 타입추론으로 인한 코드 생략
names.sorted(by: { s1, s2 in 
    return s1 > s2
})

// 암시적 반환 적용
names.sorted(by: { s1, s2 in 
    s1 > s2
})
```

> 타입추론에 의하여 by: 의 인수 타입은 Bool값을 반환해야하는 것을 알고 있습니다!

## 약식 인수 이름 (Shorthand Argument Names)

Swift는 인라인 클로저에 한해 약식 인수 이름을 제공합니다.

$0, $1, $2등 $뒤에 숫자를 부여하여 인수값을 **참조**할 수 있습니다.

이 숫자로 파라미터(인수)의 개수를 알 수 있습니다. 인수값을 자동으로 참조하기 때문에 클로저의 정의부분을 생략 할 수 있습니다. 아니 생략을 해야만 합니다. 정의 부분을 생략하기 때문에 in 키워드도 함께 생략합니다.

왜 생략해야하나? 이는 코드를 단계적으로 풀이를 해보면서 알아봅시다!

```swift
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]

// 원형
let result = names.sorted(by: { s1, s2 in 
    s1 > s2
})

// 약식 인수 사용
// $0 : 첫 번째 인수, 원형에서의 s1
// $1 : 두 번째 인수, 원형에서의 s2
let result = names.sorted(by: { $0 > $1 })

// 원형에서처럼 클로저의 정의와 약식인수를 함께 사용한다?
// 명시적 인수가 있는 경우 익명 클로저 인수를 사용할 수 없다는 컴파일 에러 !
let result = names.sorted(by: { s1, s2 in $0 > $1 })
```

> 내 생각이지만 약식 인수를 사용한다는건 타입추론에 의해 인수를 $0, $1로 참조하는 것인데 클로저 정의부분에서 인수 목록을 나열하면 참조를 못하기 때문 아닐까? $0과 $1 자체가 인수 목록을 정의와 동시에 사용하는 것이라고 생각하면 in 키워드를 생략해야 하는 것도 이해가 가능할 것 같습니다. 혹시 자세히 아시는 분이 계시다면 답글 부탁드립니다.ㅠㅠ

### 연산자 메소드 (Operator Method)

위 약식 인수 이름에서 사실 더 줄일 수 있습니다.

```swift
let result = names.sorted(by: $0 > $1}) // 이게
let result = names.sorted(by: >) // 이렇게 된다..?
```

읭? 이게 뭔가 싶으시죠? 사실 연산자도 하나의 함수라고 합니다.

Swift에서는 연산자를 구현할 수 있는데 이 연산자는 각 타입마다 모두 다르게 구현이 되어 있다고 합니다.

> 한 예로 Int 타입에서 +는 말 그대로 더하는 거고 String 타입에서 +는 두개의 문자열을 "붙이는 연산"을 하잖아요?

추후 연산자에 대해 같이 알아볼 기회가 있을 때 그때 다시 한번 파보도록 합시다!

지금 중요한건 연산자도 하나의 함수다! 위 코드에서 $0 > $1 의 >에 키보드의 option + 클릭을 해보면

아래와 같은 설명이 나올거에요

```swift
static func > (lhs: String, rhs: String) -> Bool
```

lhs는 왼쪽 rhs는 오른쪽 문자열을 뜻하는 **인수**를 가지며 그리고 Bool을 **반환**하는 "**메소드**"입니다.

sorted(by:)에서 by인수의 타입과 같지않나요? 그래서 연산자만 써주더라도 똑똑한 Swift는 다 알아먹는다네요.. 명석한놈.

> 그래도 저는 아직까지는 인수 목록을 나열하고 구현하는게 좀 더 코드를 이해하기 쉽더라구요.

## 후행 클로저(Trailing Closures)

어떤 함수의 마지막 인자의 타입이 함수 타입이라면 마지막 인자 레이블을 생략하고 외부에 클로저를 사용할 수 있는 문법입니다.

역시 말로 푸는건 어렵네요.. 코드를 보고 한번에 이해해버립시다!

```swift
// Int, () -> Void 2개의 인자를 받는 함수
func foo(number: Int, mClosure: () -> Void) {
}

// 원형
foo(number: 3, mClosure: { 
    print("in clousre")
})

// 후행 클로저로 사용!
foo(number:3) { 
    print("in clousre")
}
```

말 그대로 마지막 인자레이블을 생략하고 클로저를 사용할 수 있습니다.

### 인수가 1개 이고 함수 타입일 때

1개의 인수가 있는데 그 인수의 타입이 함수일 때는 ()도 생략할 수 있습니다.

예를 들어 이제는 많이 접한 sorted(by:)의 경우를 보죠

```swift
names.sorted { $0 > $1 }
```

()가 없지만 잘 실행 됩니다.

### 클로저가 여러개 일 때

후행 클로저는 클로저가 1개일 때만 가능하냐?! 아닙니다. 여러개여도 가능합니다!

단 첫번째 클로저는 인수를 생략하지만, 두번째 클로저부터는 인수를 명시해줘야 합니다!

```swift
func foo(first: () -> Void, two: () -> Void, three: () -> Void) {
    first()
    two()
    three()
}

foo { 
    print("hello")
} two: { 
    print("world")
} three: {
    print("wow")
}
// 출력 : 
// hello
// world
// wow

```

간단 하죠?

일반 타입의 인수 + 클로저의 조합도 가능합니다

```swift
func foo(num: Int, f1: () -> Void, f2: () -> Void) { 
    print("num : \(num)")
    f1()
    f2()
}

foo(num: 5) { 
    print("hello")
} f2: {
    print("world")
}

// 출력 :
// 5
// hello
// world
```
