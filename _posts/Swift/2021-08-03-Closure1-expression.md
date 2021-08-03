---
title: "[Swift] 클로저 표현식(Closure expression) (1)"
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

# 클로저 표현식

앞에서 클로저에 대해 살짝 맛보기를 했을 때 

*클로저란 **간결**하고 **깔끔**한 구문을 권장하는 **최적화**와 함께 **명확한 스타일**을 가지고 있다 라*고 정의하였습니다.

그리고 **최적화**에는 **타입추론**, **암시적 반환**, **약식 인수이름**, **후행 클로저** 이 4가지가 포함되어 있다고 하였죠

이제 Swift 가이드북의 예제를 따라 이를 하나하나 살펴봅시다! GoGo

> 이 전까지는 딱딱한 반말?투로 글을 써내려갔지만 오늘부터는 그날그날 써지는데로 써볼까 합니다!

> 함수 ? 메소드 ?
워낙 혼용해서 사용하다보니 궁금해서 찾아봤습니다. 함수는 그냥 전역으로 만들면 함수고 클래스나 구조체 안에서 함수를 선언하면 메소드라고 하더군요. 최대한 옳바르게 사용해보려 하겠습니다. 헷갈려...

## 왜 클로저를 사용하는가?

전역함수, 중첩된 함수, 이름없는 함수 이게 클로저라며 그럼 함수만 잘만들어서 쓰면 되는거 아냐? 왜 이런거까지 알아야해? 라고 생각이 들 수도 있으니 왜 클로저에 대해 알아야하고 뭐가 편리한지, 왜 사용해야하는지를 먼저 알아보고자 합니다!

아래와 같은 배열이 있다고 생각해봅시다.

```swift
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
```

상수로 선언된 이름 Array입니다. 문득 우리는 정렬이 하고 싶어졌어요.

그래서 찾아보니 Swift에서는 sort()와 sorted()라는 기본 정렬 메소드를 제공을 해준다는 사실을 알았습니다!

> sort() vs sorted() 
sort()는 Array 내부에서 졍렬을 하는 것이고 sorted는 정렬된 Array을 반환합니다!. 따라서 sort()를 사용하기 위해선 Array를 선언할 때 let으로 선언하면 안됩니다!.

```swift
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
print(names.sorted())
// > ["Alex", "Barry", "Chris", "Daniella", "Ewa"]
```

아주 정렬이 잘 되었네요!

근데 알파벳순이 아니라 알파벳 역순으로 정렬을 하려면? ( reverse(), reversed()를 사용하면 되지만 없다고 생각해보자구요!)

지금 사용한 메소드와 비슷한 sorted(by:)란 메소드를 찾을 수 있습니다! 

sorted(by:) 메소드의 정의부터 살펴봅시다!.

![](/assets/images/Posts/Swift/2021-08-03-Closure1-expression/sort_Declaration.png)

인자(파라미터) by는 (String, String) throws → Bool 타입이네요.

throws는 잠시 무시하고 이는 바로 **함수 타입** 입니다. 2개의 String을 받아 Bool을 반환하는 함수를 인자로 넘겨줘야 하죠 

> sorted(by:) 메소드는 인자로 받은 함수를 통해 정렬된 배열을 return하는 메소드입니다.
인자로 넘길 함수는 1번째와 2번째 String 중 어떤걸 먼저 나타낼지를 결정합니다. 반환값이 true면 1번째 String을 먼저 나타내고 false이면 2번째 String을 먼저 나타냅니다.
지금은 이 인자의 함수가 어떤역할인지가 중요한게 아니라 인자 레이블 by: 가 **함수 타입**이란 것이 중요하여 대략적으로 설명했습니다!

자 그럼 함수 타입의 인자로 넘길 함수를 만들어 봅시다! 

```swift
// (String, String) -> Bool 타입의 함수
func backward(_ s1: String, _ s2: String) -> Bool { 
    s1 > s2 // 단일 표현식이므로 return 생략
}

let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]

print(names.sorted(by: backward))
// 출력 : ["Ewa", "Daniella", "Chris", "Barry", "Alex"]

```

와우! 알파벳 역순으로 잘 출력이 되네요.

하지만..여기서 만약에.. 앞의 문자가 아닌 중간의 문자를 가지고 정렬을 하고 싶다면? 혹은, 마지막 문자를 가지고 정렬을 하고 싶다면 아래와 같은 코드가 작성될 것입니다.

```swift
func middleBackward(_ s1: String, _ s2: String) -> Bool { ... }
func middleForward(_ s1: String, _ s2: String) -> Bool { ... }
func endBackward(_ s1: String, _ s2: String) -> Bool { ... }
func endForward(_ s1: String, _ s2: String) -> Bool { ... }

names.sorted(by: middleBackward)
names.sorted(by: middleForward)
names.sorted(by: endBackward)
names.sorted(by: endForward)
```

이렇듯 단순히 정렬기준이 바뀌었을 뿐인데 함수타입을 넘기기 위해 여러 함수를 만들어줘야 합니다.

하지만 이를 이름 없는 클로저로 생성한다면 아래와 같은 코드가 가능해집니다.

```swift
let result = names.sorted {
    $0 < $1
}
print(result)
```

sorted 뒤에 있는 { } 영역이 바로 클로져입니다. 함수를 따로 만들어 줄 필요 없이 그때 그때 필요한 내용만 넣어주면 되죠. 그럼 본격적으로 클로저를 어떻게 사용하는지, 어떤 편의성을 제공하는지 알아봅시다!

> 분량조절 실패로 다음글에서 자세하게 알아보겠습니다!
