---
title: "[iOS] UIGestureRecognizer"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- Event
- Gesture Recognizer
- UITapGestureRecognizer
- UISwipeGestureRecognizer
- UIPanGestureRecognizer
- UIScreenEdgePanGestureRecognizer
- UILongPressGestureRecognizer
- UIRotationGestureRecognizer
- UIPinchGestureRecognizer
toc: true
toc_sticky: true
toc_label: 목차
---

## 개요

Gesture Recognizer는 일련의 터치를 인식하고, 인식에 따라 동작하는 로직을 분리 시킨다

즉, 제스처를 인식하거나 제스처의 변경을 인식하면 연결된 Target에 Action 메세지를 보낸다

> 단순 제스처를 인식하는 것은 Discrete, 제스처의 변경을 인식하고자 하면 Continuous를 사용
> 

UIGestureRecognizer 클래스는 이런 Gesture Recognizer가 구성되야하는 공통의 동작 세트를 정의하고 있다.

또한, UIGestureRecognizerDelegate 타입인 delegate 프로퍼티를 사용해 다른 객체와 통신할 수 있으며

delegate를 통하면 일부 동작을 보다 세부적으로 custom 할 수 있다

추가로 하나 이상의 Target-Action이 연결되어 있어서 특정 제스처가 인식되면 Target에 Action 메세지가 전달되어 인식되었을 때 실행되야할 메서드가 실행된다

View에 UIGestureRecognizer가 있다면 Window는 터치 이벤트를 View에 전달하기 전에 **UIGestureRecognizer 객체에 먼저 전달**하게 된다.

UIGestureRecognizer가 전달받은 터치 이벤트에서 **특정 제스처로 인식**한다면 UIGestureRecognizer가 이벤트를 처리하고 **View로 전달된 터치 이벤트는 취소하고, 나머지 터치 이벤트도 전달하지 않는다.**

UIGestureRecognizer 전달받은 터치 이벤트에서 제스처로 **인식하지 못하면 View로 터치 이벤트를 전달**하게 된다.

이러한 이벤트 전달 흐름은 `UIGestureRecognizer` 객체의 3가지 프로퍼티 값을 사용하여 결정하게 된다

- `cancelsTouchesInView` : gesture recognizer가 제스처를 인식하면 `View`로 터치 이벤트를 전달하는 여부에 관한 프로퍼티
기본값은 `true`
`true` 일 때 동작 : 제스처를 인식하면 `View`로 `touchesCancelled` 메시지를 보내 이전에 전달된 터치 이벤트를 취소하고, 이전에 전달된 이후의 이벤트들을 `View`로 전달하지 않음
`false` 일 때 동작 : 제스처 인식 여부와 상관없이 모든 터치 이벤트를 View로 전달함
- `delaysTouchesBegan`
기본값은 `false`
`true` 일 때 동작 : `began` 페이즈의 터치 이벤트를 `View`로 전달하는 시간을 지연시키고 있다가
 gesture recognizer의 인식이 실패하면 터치 이벤트를 전달함
`false` 일 때 동작 : began 페이즈의 터치 이벤트를 gesture recognizer, `view`에 병렬로 전달
- `delaysTouchesEnded` 
기본 값은 `true`
delaysTouchesBegan과 같은 동작이지만 ended 페이즈 터치 이벤트에 적용

## SubClass

기본적으로 정의되어 있는 Subclass는 7개가 존재. 

**Discrete**

- UITapGestureRecognizer
- UISwipeGestureRecognizer

**Continuous**

- UIPinchGestureRecognizer
- UIRotationGestureRecognizer
- UIPanGestureRecognizer
- UIScreenEdgePanGestureRecognizer
- UILongPressGestureRecognizer

### UITapGestureRecognizer

짧게 터치하는 하나 이상의 손가락을 인식

Discrete 제스처이기 때문에 `state`가 `ended`일 때 Action이 호출

`numberOfTapsRequired` : 탭하는 횟수 설정

`numberOfTouchesRequired` : 탭하는 손가락의 수를 설정

인식 조건 : 설정된 탭하는 손가락의 갯수로 설정된 탭의 횟수와 일치

```swift
class OneTapGestureRecognizerView: UIView {
	let gestureRecognizer = UITapGestureRecognizer() // Discrete 제스처
	
	override init(frame: CGRect) {
	    super.init(frame: frame)
	    gestureRecognizer.addTarget(self, action: #selector(handleTapGesture(_:)))
	    addGestureRecognizer(gestureRecognizer)	
	}
	
	required init?(coder: NSCoder) {
	    fatalError("init(coder:) has not been implemented")
	}
}

// MARK: - Gesture Action
extension OneTapGestureRecognizerView {
    @objc func handleTapGesture(_ sender: UITapGestureRecognizer) {
        print("tap! state: \(sender.state.rawValue)")
    }
}
```

### UISwipeGestureRecognizer

swipe 제스처를 인식하는 GestureRecognizer

**swipe 제스처**란 **가로나 세로방향으로 손가락을 움직이는 것**을 말함

**Discrete 제스처**이기 때문에 **손가락을 추적하지 않고 swipe 제스처인지만 판단**

`numberOfTouchesRequired` : 스와이프 하는 손가락 수 

`direction` : 스와이프 방향, left / right / up / down을 정할 수 있음

```swift
class RecognizerView: UIView {
	override init(frame: CGRect) {
		super.init(frame: frame)
        
    let leftSwipeGesture = UISwipeGestureRecognizer(target: self,
                                                    action: #selector(swipeLeftGestureRecognizer(_:)))
    let rightSwipeGesture = UISwipeGestureRecognizer(target: self,
                                                     action: #selector(swipeRightGestureRecognizer(_:)))
    let topSwipeGesture = UISwipeGestureRecognizer(target: self,
                                                   action: #selector(swipeTopGestureRecognizer(_:)))
    let downSwipeGesture = UISwipeGestureRecognizer(target: self,
                                                    action: #selector(swipeDownGestureRecognizer(_:)))
    
    leftSwipeGesture.direction = .left
    rightSwipeGesture.direction = .right
    topSwipeGesture.direction = .up
    downSwipeGesture.direction = .down

		// addGestureRecognizer(_:) 대신 직접 배열에 설정도 가능        
    gestureRecognizers = [leftSwipeGesture, rightSwipeGesture, topSwipeGesture, downSwipeGesture]
	}
}

extension RecognizerView {
	@objc func swipeLeftGestureRecognizer(_ sender: UISwipeGestureRecognizer) {
    print("[swipe left] state : \(sender.state.rawValue)")
	}
	@objc func swipeRightGestureRecognizer(_ sender: UISwipeGestureRecognizer) {
    print("[swipe right] state : \(sender.state.rawValue)")
	}
	@objc func swipeTopGestureRecognizer(_ sender: UISwipeGestureRecognizer) {
    print("[swipe top] state : \(sender.state.rawValue)")
	}
	@objc func swipeDownGestureRecognizer(_ sender: UISwipeGestureRecognizer) {
    print("[swipe down] state : \(sender.state.rawValue)")
	}
}
```

### UIPanGestureRecognizer

Pan 제스처는 **Continuous 제스처 타입**으로 간단히 말해서 Drag와 비슷한 개념

View를 Panning하기 위해서는 **하나 이상**의 손가락이 필요함

> 최소 하나 이상이기 때문에 설정에 따라 두 개, 세 개의 손가락도 가능하다는 뜻
> 

Pan 제스처로 인식되기 위해서는 설정된 최소 손가락수로 설정된 최소거리는 움직여야함

minimumNumberOfTouches, maxmumNumberOfTouch로 각각 최소 손가락수, 최대 손가락수를 설정할 수 있다

최소 손가락으로 설정된 최소 거리만큼 움직였다면 PanGestureRecognizer는 이를 Panning 제스처로 인식하고 `state`를 `began`으로 설정하고 이후 손가락을 **추적**한다.

`began` 상태에서 손가락을 움직일 때 마다 `changed`로 변경이 되고 손을 떼면 `ended`로 변경된다

<Pan 제스처 인식조건 정리>

`began` : 설정된 손가락 수로 설정된 거리를 이동한 시점

`changed` : `began` 이후 손가락을 움직일 때 마다

`ended` : 손을 뗀 시점

인식이되면 `recognizer` 인스턴스의 `translation(in:)` 메소드를 사용하여 **초기 위치**(`began` 페이즈로 진입한 시점의 터치 위치)로부터 **이동한 거리**를 얻을 수 있다.

![](/assets/images/Posts/iOS/2022-01-25-Recognizer/pan.jpeg)

`translation(in:)` 메소드는 `CGPoint` 타입을 반환 하며 반환받은 값의 `x`, `y` 값을 사용하여 이동한 거리를 구해 `contents`를 이동시킬 수 있다.

```swift
@objc func panHandler(_ sender: UIPanGestureRecognizer) {
    let point = sender.translation(in: recognizerView)
    recognizerView.center = CGPoint(x: recognizerView.center.x + point.x,
                                    y: recognizerView.center.y + point.y)
    sender.setTranslation(.zero, in: recognizerView)	
}
```

`setTranslation(:,in:)` 메소드를 사용하여 다시 `translation`값을 `zero`로 설정해주었는데

그 이유는 `PangestureRecognizer`의 `translation`값은 **이전 값에서 얼마나 떨어졌는지가 아니라**,

`state`가 `began`단계 일 때의 점, 즉 **원점에서 얼마나 떨어졌는지를 나타내는 값**이기 때문이다.

움직이고자 하는 `view`를 포함한 contents에 이 `translation`값을 사용하여 변화를 주었다면

그 시점에서 변화된 contents의 `translation`을 0으로 주어, 즉 **이 지점이 새로운 원점**임을 알려주어야 

개발자가 의도한대로 Pan Gesture를 핸들링할 수 있다

### UIScreenEdgePanGestureRecognizer

PanGestureRecognizer의 서브클래스이다.

따라서 PanGestureRecognizer의 프로퍼티, 메소드를 모두 사용할 수 있다.

ScreenEdgePanGesture는 화면의 가장자리에서 시작하는 Pan 제스처를 말한다.

UIScreenEdgePanGestureRecognizer의 edges 프로퍼티로 인식하고자 하는 EdgePanGesture를 설정할 수 있다. 

![](/assets/images/Posts/iOS/2022-01-25-Recognizer/edges.jpeg)

```swift
private func gestureConfiguration() {
    setGesture(action: #selector(handleEdgePanGesture(_:)),
               edges: .right)
    setGesture(action: #selector(handleEdgePanGesture(_:)),
               edges: .left)
    setGesture(action: #selector(handleEdgePanGesture(_:)),
               edges: .top)
    setGesture(action: #selector(handleEdgePanGesture(_:)),
               edges: .bottom)
}
private func setGesture(action: Selector, edges: UIRectEdge) {
    let edgePanGesture = UIScreenEdgePanGestureRecognizer(target: self,
                                           action: action)
    edgePanGesture.edges = edges
    addGestureRecognizer(edgePanGesture)
}
```

### UILongPressGestureRecognizer

LongPressGesture는 View에서 **길게 터치하는 Continuous 제스처**를 말함

초기 인식 조건은 **설정된 손가락 수**로 최소 **터치를 유지해야하는 시간**동안 **허용가능한 이동범위**를 초과하지 않아야한다

`numberOfTouchesRequired` : 손가락 수 설정

`minimumPressDuration` : 터치를 유지해야하는 시간

`allowableMovement` : 초기 인식까지 허용가능한 이동 범위, 기본값은 10 “픽셀”

> `allowableMovement`는 `began`으로 진입 하는 조건에만 영향을 미치며, began 진입 이후에는 움직임에 제한을 두지는 않는다.
> 

보통 `UIMenuController`를 보여주는데 많이 사용하는 것 같다.

### UIRotationGestureRecognizer

Rotation 제스처는 **첫 두 손가락이 서로를 중심으로 회전하는 Continuous 제스처**이다

따라서 RotationGestureRecognizer는 회전하는 두 손가락의 움직임을 추적하여

필요에 따라 Contents를 회전시킬 수 있다.

Rotation Gesture Recognizer는 `rotation` 프로퍼티를 통해 회전값을 **라디안** 단위로 제공한다

recognizer의 `began` `state`에서 두 손가락 사이의 선을 가정하여 그리게 되고 그 **선을 기준**으로

`rotation`의 값은 **0으로 설정**된다.

이후 `changed` `state`에서 움직인 두 손가락사이의 선을 다시 그리게 되는데, 이때 `began` `state`에서 **그린 선을 기준으로 하여 새로 그린 선과의 각도를 계산**하여 `rotation` 프로퍼티에 저장한다.

PanGestureRecognizer의 `translation`과 마찬가지로 `began` 단계의 **값을 기준**으로 하기 때문에 

`rotation` 값으로 컨텐츠에 적용하는 등 영향을 주었다면 `rotation`을 그 시점에 **0으로 재설정** 해주어야 한다.

![](/assets/images/Posts/iOS/2022-01-25-Recognizer/rotations.jpeg)

```swift
@objc func rotationHandle(_ sender: UIRotationGestureRecognizer) {
	rotationView.transform = rotationView.transform.rotated(by: sender.rotation)
	// 변경된 transfrom 기준으로 각도를 0으로 설정
	sender.rotation = 0
}
```

### UIPinchGestureRecognizer

Pinch 제스처는 **2개의 손가락의 거리를 추적**하는 **Continuous 제스처**

보통 zoom 기능을 구현할 때 사용

**거리를 추적**하기 때문에 두 손가락사이의 거리가 좁혀지면 축소, 멀어지면 확대를 하게 되고

PinchGestureRecognizer는 이 **거리에 대한 정보**를 `scale` 프로퍼티로 제공한다.

> scale은 비율을 뜻하는 것 같음
> 

따라서 `translation`, `rotation`과는 다르게 **초기 값은 1.0으로 시작**하며 두 손가락 사이의 거리가

멀어지거나 가까워짐에 따라 scale값 또한 커지거나 작아진다

`translation`, `rotation`과 마찬가지로 `scale`값으로 contents에 영향을 주었다면 **다시 초기값인 1로 설정해주어야 한다.**

```swift
@objc private func pinchHandler(_ sender: UIPinchGestureRecognizer) {
	pinchTargetView.transform = pinchTargetView.transform.scaledBy(x: sender.scale, y: sender.scale)
	sender.scale = defaultScale
}
```
## 코드 및 프로젝트

전체 소스는 아래에서 확인

[Github](https://github.com/sweetfood-dev/iOSTutorialProject/tree/main/SampleTouchEvent)

## 참고

[Handling UIKit Gestures](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/handling_uikit_gestures)

[UIGestureRecognizer](https://developer.apple.com/documentation/uikit/uigesturerecognizer)
