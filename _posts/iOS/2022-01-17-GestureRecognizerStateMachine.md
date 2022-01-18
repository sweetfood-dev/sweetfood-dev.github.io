---
title: "[iOS] Gesture Recognizer State Machine"
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
- State Machine
toc: true
toc_sticky: true
toc_label: 목차
---

![](/assets/images/Posts/iOS/2022-01-18-Recognizer/recognizer2.jpeg)

![](/assets/images/Posts/iOS/2022-01-18-Recognizer/recognizer3.jpeg)

## 개요

Gesture Recognizer는 **이벤트의 처리를 보장하기 위해 state machine을 사용**

state machine은 아래와 같은 중요한 동작을 결정함

- **Continuous Gesture recognizer**가 **Began state에 들어갈 수 있는지**
- **Discrete Gesture recognizer**가 **Ended state에 들어갈 수 있는지**
- Gesture recognizer에 연결된 **action 메소드의 호출 시점**

따라서 Custom Gesture recognizer구현할 때에는 적절한 시점에 **state machine을 업데이트**해야함

Gesture recognizer의 state는 항상 **Possible state에서 시작**을 하게 된다

> possible : 이벤트 처리를 시작할 준비가 된 상태
> 

Discrete / Continuous Gesture recognizer 모두 possible에서 시작하는 것은 동일하지만

ended / failed / cancelled 값이 되기 까지는 **다른 과정을 거친다**

> Gesture Recognizer의 state는 이벤트 처리 후 성공 / 실패 / 취소에 따라 각각 ended / failed / cancelled 값을 가짐 즉 해당 값들은 이벤트 처리의 결과를 나타냄
> 

Gesture recognizer의 이벤트 처리가 끝나는 시점에 ended / failed /cancelled 값이 되며, 이벤트 처리가 모두 끝나면 UIKit은 Gesture recognizer의 state 값을 possible로 변경한다

## Discrete Gesture recognizer의 state 전환

Discrete Gesture recognizer의 `state`는 `possible`에서 이벤트 처리 결과에 따라 `failed` / `recognized`( = `ended`)로 설정된다.

따라서 Custom Discrete Gesture recognizer을 구현할 때는 `state`값을 조건에 따라 `failed` / `recognized` 둘중 한가지 값으로 업데이트 해야한다

Discrete Gesture recognizer에서는 `state`가 `recognized`(`ended`)일 때만 Gesture recognizer와 연결된 View(Target)의 **Action 메소드가 호출**된다.

## Continuous Gesture recognizer의 state 전환

Continuous Gesture recognizer는 Discrete보다 좀 더 복잡한 state 값의 전환이 이루어진다

크게 3단계로 나뉜다

- 1 단계 : 초기 이벤트 시퀀스에 따라 Gesture recognizer state가 Began / Failed로 전환
- 2 단계 : state가 Began인 경우, 조건에 따라 changed / cancelled 로 전환
- 3 단계 : state가 changed 인 경우 제스처의 패턴과 일치하면 recognized(ended)로 전환

Continuous Gesture recognizer는 **state가 Began, Changed, Recognized(ended)일 때 Gesture recognizer와 연결된 View의 Action 메소드가 호출**된다.

따라서 `state`가 이미 `changed`일 경우에도 후속 이벤트가 조건과 일치한다면 `changed` 값으로 다시 설정하여야 **Action 메소드가 호출**되어진다.

## Handling Cancellation

현재 처리중인 이벤트 시퀀스가 전화 수신같은 **시스템 이벤트에 의해 중단되면** 자동으로 `state`값은 `cancelled`로 전환된다.

또한 개발자가 특정 조건에 따라 state값을 cancelled로 전환할 수도 있다.

시스템이 제스처를 취소할 때 `touchesCancelled` / `pressCancelled` 메소드를 호출하는 데

이 때 Gesture recognizer의 `state`를 `cancelled`로 설정해주어야 함

> state 값이 cancelled가 되면 UIKit이 Gesture recognizer를 resetting하기 전에 action메소드를 마지막에 호출해준다고 하였는데 아무리 해봐도 나타나지 않았다.. 어떻게 재현해야 하는지 아시는분 계신가요?
> 

## Resetting the Recognizer state machine

UIKit은 Gesture recognizer에서 이벤트 처리가 끝나면 `state`값을 다시 `possible`로 변경하기 전에 `reset()` 메소드를 호출하는데 이 메소드를 오버라이드 하여 Gesture recognizer의 프로퍼티를 초기상태로 되돌릴 수 있다.
