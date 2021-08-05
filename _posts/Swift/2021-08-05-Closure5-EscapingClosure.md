---
title: "[Swift] 탈출 가능한 클로저 (Escaping Closure)"
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

## Escaping Closure란?

직역하자면 탈출 클로저입니다? 무슨 탈출??

**함수의 인자로 사용**되는 클로저는 **사용 시점**에 따라 **Non-Escape 클로저**와 **Escaping 클로저**로 구분할 수 있습니다. 하나하나 알아봅시다!

## Non-Escaping 클로저

**함수의 인자**로 전달받은 클로저가 함수가 **종료되기 전에 실행되어지는 클로저**를 말합니다.

```swift
func foo(mClosure: () -> Void) {
    mClosure()
}

foo { print("hello world") }
```

1. 함수 foo는 mClosure라는 클로저를 **전달** 받고 
2. 전달 받은 **클로저**를 foo 함수의 본문에서 **사용**하고
3. foo 함수는 **종료**됩니다.

이렇게 클로저를 함수의 인자로 전달 받았을 때 해당 **함수가 종료되기 전에 실행**되는 **클로저**를

**Non-Escaping 클로저**라고 합니다.

Non-Escaping 클로저는 함수 밖에서 사용하거나 반환으로  사용 할 수 없습니다.

```swift
func foo(mClosure: () -> Void) -> () -> Void {
    mClosure()
    return mClosure // 컴파일 에러!!! 반환할 수 없다 ㅠㅠ  
}

let close = foo {
    print("hello world")
}

print(close())
```

```swift
var myClosure = [() -> Void]()

func foo(mClosure: () -> Void) {
    myClosure.append(mClosure)
}

foo {
    print("hello world")
}

myClosure.first?()
```

함수 밖에서 사용하거나 반환으로 사용하기 위해서는 **Escaping 클로저**로 사용하여야 합니다.


## Escaping 클로저

Non-Escaping 클로저와는 반대로 인자로 전달받은 클로저가 **함수가 종료된 후**에 **실행되어지는 클로저**를 말합니다.

```swift
var completionHandlers = [() -> Void]()

func someFunctionWithEscapingClosure(completionHandler: @escaping () -> Void){
    completionHandlers.append(completionHandler)
}

someFunctionWithEscapingClosure { print("Hello world") }

completionHandlers.first?()
```

() → Void 타입의 클로저를 가질 수 있는 배열 completionHandlers를 선언하였습니다.

함수 someFunctionWithEscapingClosure는 () → Void 타입의 클로저를 받아 completionHandlers에 추가 해주고 **종료합니다.**

이제  코드의 실행 순서를 따라가봅시다!

1. print("Hello world") 를 실행하는 클로저를 somFunctionWithEscapingClosure로 전달
2. 배열 completionHandlers에 추가
3. 함수 **종료**
4. 배열 completionHandlers의 첫번째 클로저 **실행**

**함수가 종료 된 이후**에 **클로저가 실행**되죠? 이것에 바로 Escaping 클로저입니다. 

Escaping 클로저로 사용하기 위해서는 파라미터 타입 앞에 @escaping 키워드를 붙여 이 클로저가 escaping 할 수 있는 클로저임을 알려주어야 합니다.

@escaping 키워드가 없다면 기본적으로 탈출 불가한 클로저라고 판단하여 컴파일 오류가 나타나겠죠!?

보통 비동기로 실행되는 함수에서 Escaping 클로저를 많이 사용합니다. 추후에 다룰 기회가 있을테니 그 때 예제코드로 다시한번 학습할 기회가 있을 것 같습니다!

## 최적화를 위한 @escaping

```swift
func foo(_ completion: @escaping () -> Void) {
    completion()
}
```

탈출 가능한 클로저를 인자로 받는 함수이지만 실제 사용은 탈출불가능한 클로저로 사용하고 있습니다.

이렇게 사용하여도 별 문제는 일어나지 않습니다.

그러면 기본적으로 클로저를 인자로 받는 경우 기본적으로 그냥 @escaping 으로 처리해주면 되지 않나?

왜 번거롭게 나누는거지? 라고 생각이 들 수 있겠죠?

그 이유는 바로 **최적화**때문입니다.

일전에 Swift의 메모리 관리에 대해 살짝 언급을 했었는데요. 간단히 말하면 참조 타입의 경우 참조하는 횟수를 가지고 메모리에서 해제를 해도 되는지, 계속 유지를 해야하는지를 판단하는거라고 생각하시면 될 것 같아요

non-escaping 클로저의 경우 함수 안에서 무조건 실행이 되고 끝나는게 보장이 되기 때문에 클로저가 실행이 되고 종료되는 시점을 명확하게 알 수 있습니다. 즉, 어떤 참조 타입을 클로저 안에서 참조를 하게 되어도 해당 함수가 종료되기 전에 이 클로저가 실행되고 끝나는걸 보장하기 때문에 참조 횟수를 딱히 신경 쓰지 않아도 되는거죠!

한마디로 non-escaping 클로저는 메모리 관리에 있어서 추가 오버헤드가 발생되지 않겠죠

하지만 escaping 클로저의 경우 함수의 외부에서 호출되기 때문에 언제 실행되는지 모릅니다. 오히려 이 클로저를 언제든 실행할 수 있도록 도와주어야 합니다.

 탈출 가능한 클로저의 안에서 참조타입을 사용할 경우 이 클로저가 실행되기 전에 해당 참조 타입이 메모리에서 없어져있으면 안되겠죠 ? 그렇다면 메모리 관리에 있어서 추가 오버헤드가 들어가고 성능적으로 봤을 때 비용이 더 들어가게 되기 때문에 Swift에서는 이러한 성능의 퍼포먼스와 최적화를 위해 필요할 때만 escaping 클로저로 사용할 수 있도록 해두었다고 합니다!

## 정리

1. Non-escaping 클로저는 함수의 인자로 들어온 클로저가 해당 함수가 종료되기 전 실행되는 클로저
2. escaping 클로저는 함수의 인자로 들어온 클로저가 함수가 종료되고난 후에 실행되는 클로저
3. 성능의 최적화를 위해 함수 내에서 클로저가 사용될 때는 escaping 클로저로 선언하지 말자!
