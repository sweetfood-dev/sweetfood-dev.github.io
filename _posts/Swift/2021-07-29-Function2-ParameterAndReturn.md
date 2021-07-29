---
title: "[Swift] Function(2) Parameter와 Retrun"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Function
toc: true
toc_sticky: true
toc_label: 목차
---

# Parameter 와 Returns

## Parameter가 없는 함수

파라미터는 기본적으로 함수의 이름 뒤에 오는 () 사이에 정의해주는데 파라미터가 없는경우 그냥 ()만 작성한다

```swift
func noParameter()
```

## Parameter가 있는 함수

1개 혹은 그 이상의 파라미터도 정의 가능하다.

()안에 파라미터이름 : Type 으로 정의하며 1개 이상일 때는 , 로 구분을 해준다

```swift
func oneParameter(param1: Int)
func twoParameter(param1: Int, param2: String)
func threeParameter(param1: Int, param2: String, param3: [Double])
```

## Return이 없는 함수

Return 값이 있는 경우 파라미터 정의 끝에 → Type 으로 작성을 해준다. 다만 Return 값이 없을 경우 

→ Type은 생략 해주면 된다!

> Return의 Type에는 모든 타입이 들어갈 수 있으며 옵셔널 또한 가능하다!

```swift
func noReturnFunc()
```

> 엄밀히 말하자면 Return값이 있다 바로 → Void 인데 Void는 () Type의 빈 튜플이다

```swift
func noReturnFunc() // 이 함수는 엄밀히 말하자면
func noReturnFunc() -> Void  // 요 함수이다. 
```

## Return이 있는 함수

### Return이 1개만 있을 경우

```swift
func returnOneFunc(parameter: Int) -> Int {
	return parameter
}
```

위 처럼 → Type을 뒤에 붙여 주며 함수 내부에서는 해당 Type의 값이나 변수를 return 해주어야 한다.

### 단일 표현식에서의 Return

위의 예제처럼 단일 표현식의 경우에는 return의 생략이 가능하며 추후 학습할 프로퍼티 getter에서도 이런 문법은 동일하게 적용 된다

```swift
func returnPlusThree(parameter: Int) -> Int {
    parameter + 3 // return 생략 가능
}
```

### 여러 Return값이 있는 함수

앞서 학습한 튜플을 사용하면 된다!

```swift
func returnTwoValue(array: [Int]) -> (min : Int, max: Int) {
    let minValue = array.min()! // 옵셔널 강제 해제
    let maxValue = array.max()! // 옵셔널 강제 해제
    
    return (minValue, maxValue)
}

let result = returnTwoValue(array: [1,2,3,4,5])
result.max 
result.min
```

이때 Return에 정의한 튜플은 앞서 학습한 튜플의 기능을 모두 사용할 수 있다.

이 코드에서는 min,max라는 별칭을 정해줬으며 함수의 return을 받은 result 상수에서 해당 별칭을 사용하였다.

## 함수의 인수 레이블과 파라미터(매개변수) 이름

모든 함수에는 **인수 레이블**과 **파라미터 이름**이 있다.

**인수 레이블**은 **함수를 호출**할 때 사용하고 **파라미터 이름**은 **함수 내부**에서 사용한다

만약 인수 레이블을 따로 작성하지 않으면 인수레이블은 파라미터 이름과 같다

```swift
func myFunction(value: Int) // value는 인수 레이블이자 파라미터 이름!
```

### 인수 레이블

인수레이블 작성은 파라미터 이름 앞에 공간을 두고 작성한다

```swift
func myFunction(label parameter: Int){ // 인수레이블은 label, 파라미터 이름은 parameter
    let plusOne = parameter + 1 // 함수 내부에서는 파라미터 이름을 사용
}

myFunction(label: 3) // 함수 호출시에는 인수 레이블을 사용
```

위의 코드에서 볼 수 있듯 인수 레이블은 함수 호출 시 사용하고 파라미터 이름은 함수의 내부에서 사용한다

이러한 레이블은 적절히 사용한다면 영어 문장처럼 표현할 수 있어 **가독성**이 좋아지는 장점이 있다.

```swift
func greet(person: String, from hometown: String) -> String {
    // 단일 표현식으로 return 생략
    "Hello \(person)! Glad you could visit from \(hometown)
}

print(greet(person:"jisoo", from: "home"))
```

#### 인수레이블의 생략

print()처럼 인수가 없는 함수는 인수 레이블 위치에 _ 를 사용하여 만든다

```swift
func emptyLabel(_ text: String) {
    print(text)
}

emptyLabel("인수레이블 없이 사용할 수 있어요")

```

### 파라미터(매개변수)

#### 기본값

파라미터 정의 다음에 값을 **할당**하여 기본값을 사용할 수 있다.

기본값을 설정하면 함수 호출 시 기본값이 설정되어 있는 인자 레이블은 생략이 가능하다.

생략을 하게 되면 함수 내부에서 파라미터를 사용할 때 기본값이 적용된다

```swift
func defaultValue(num value: Int = 10) {
    print(value)
}

defaultValue() // 10
defaultValue(num: 20) // 20
```

> 파라미터의 Type은 유형 추론이 안된다!

#### 가변 파라미터

가변파라미터를 사용하면 0개 이상의 값을 사용할 수 있다.

파라미터 Type뒤에 ...를 붙여 선언한다. 

가변 파라미터로 전달된 값은 함수 내에서 Array로 사용이 가능하다.

하지만 함수 호출 시에는 인자레이블의 Type으로 호출을 해야한다

```swift
func variadicParameter(num numbers: Int...) -> Int{
    let result = numbers.reduce(0, +) // 배열의 모든 요소를 더해줌
    return result
}

variadicParameter(num: 1,2,3,4,5,6) // 21
variadicParameter(num: [1,2,3,4,5,6]) // Int Type이 아닌 Array Type 으로 컴파일 에러
```

## Swift Version에 따른 변경점 

### Swift 5.4

5.4 버전 이후 부터 가변 파라미터를 한개 이상 사용할 수 있다!

이전 버전에서는 2개 이상 사용 시
>Only a single variadic parameter '...' is permitted

오류가 발생하였는데

5.4 이후 부터 [인수 레이블](https://sweetfood-dev.github.io/swift/Function2-ParameterAndReturn/#인수-레이블)만 달려 있다면 1개 이상의 가변 파라미터를 사용할 수 있다!

```swift
func foo(_ a:Int, b: Double...) {} // Swift 5.4 이전 오류
foor(1, 2, 3, 4, 5, b: 1.0, 2.0, 3.0) // Swift 5.4 이후 사용 가능 

```
