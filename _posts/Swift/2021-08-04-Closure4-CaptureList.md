---
title: "[Swift] 클로저 캡쳐 리스트(Closure Capture Lists)"
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

## 캡처 리스트

주변 컨텍스트를 참조 타입이 아니라 값 타입으로 사용하지는 못할까?

아래와 같은 코드가 있다고 생각해봅시다.

```swift
var index = 0
var closureArray = [() -> ()]()

for _ in 0 ..< 5 {
    closureArray.append({print(index)})
    index += 1
}

closureArray.forEach {
    $0()
}
```

출력 결과는 5 5 5 5 5가 나오게 됩니다.

읭?? 이라는 반응이라면 천천히 코드를 따라가봅시다.

처음 for문에서 closureArray에 print(index)하는 클로저를 담아 줍니다.

그리고 index 값에 1을 더해 주죠 

이러한 행동을 5번 반복합니다.

closureArray에는 5개의 클로저(**print(index)를 하는 클로저**) 가 들어가있고

index는 5가 된상태겠죠?

그리고 closureArray에 있는 클로저를 처음부터 끝까지 실행 시킵니다.

print(index)를 실행 시키겠죠? 

index는 다들 아시겠지만 5인 상태이니 5 5 5 5 5 가 출력 될것입니다.

이처럼 **참조에 의한 캡처된 변수**는 **실행 시점**에서의 값이 되어집니다!

그럼 그냥 클로저를 선언했을 때의 값을 사용하고 싶다면 어떻게 해야할까요?

이때 **캡처 리스트**를 사용하게 됩니다. 캡처 리스트 항목은 **클로저가 생성될 때 해당 값으로 초기화**됩니다. 

저 코드를 수정해 봅시다!

```swift
var index = 0
var closureArray = [() -> ()]()

for _ in 0 ..< 5 {
    closureArray.append({ **[index]** in 
    print(index)
})
    index += 1
}

closureArray.forEach {
    $0()
}
```

append 함수 바로 옆에 [index] in 이 보이시나요? 

네 저기서 대괄호를 포함한 [index]가 바로 캡처 리스트입니다!

클로저가 생성될 때 저 캡처리스트의 항목 index는 클로저 밖의 index의 값이 **복사**되어 초기화 됩니다.

실행하면 0 1 2 3 4 값이 출력되는걸 볼 수 있습니다!

캡처 리스트로 사용되는 변수는 참조에 의해 캡처된 변수와는 다르게 클로저 내부에서 수정을 하여도 외부 변수에 영향을 주지 않으며 마찬가지로 외부에서 수정을 하여도 클로저 내부에 영향을 주지 않습니다.

말로 하니 뭔가 싶으시죠? 그냥 간단하게 코드로 봅시다!

```swift
var a = 0 
var b = 0 

let foo = { [a] in
    print("a = \(a) b = \(b)")
}

a = 10
b = 10
foo()
// a = 0 b = 10
```

실행하면 a = 0 b = 10 이 출력됩니다. 캡처리스트는 생성 시점에 값을 사용하기 때문에 당연한거겠죠?

## 정리

1. 참조에 의한 캡처(참조 타입)는 **클로저가** **실행**될 때의 값
2. 캡처리스트를 사용하면 값 타입으로 캡처를 하고 이때는 **클로저가 생성**될 때의 값이다!
3. 캡처리스트로 만든 변수는 외부 변수에 영향을 주지도 받지도 않는다

> 캡처리스트는 후에 알아볼 순환참조에서도 사용됩니다.
순환참조에서의 캡처리스트는 여기서 설명한 용도와는 사뭇 다르고 순환참조라는 개념에 대해 
이해가 된 상태에서 학습하는게 좋을 것 같아 추가적인 설명은 그때 같이 하도록 하겠습니다!
