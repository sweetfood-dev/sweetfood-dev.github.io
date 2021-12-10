---
title: "[iOS] Main Event Loop"
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
- Run Loop
toc: true
toc_sticky: true
toc_label: 목차
---
Custom Slider Bar를 만들기 전 Event의 흐름과 처리방법등 전반적인 로직을 이해하기 위해 스터디한 내용을

정리

## 개요

Main Event Loop에서 Application은 들어오는 [Event](https://sweetfood-dev.github.io/ios/2-event/)를 지속적으로 Object에 전달하고

event 처리의 결과를 업데이트함

Main Event Loop는 이름이 거창하지만 단순히 **Run Loop**일 뿐이다.

Cocoa Application에서 메인 스레드의 **run loop**(main event loop를 말하는거 같음)는 Application 객체가 자동으로 실행해 줌

Main Event Loop는 터치, 키보드를 사용한 입력 같은 사용자의 action에 의해 생성된 **Event**를 운영체제(iOS, 혹은 OSX)로부터 전달 받는다. 

![MainEventLoopDiagram.png](/assets/images/Posts/iOS/2021-12-10-Event/MainEventLoopDiagram.png)

## Application Object Get and Dispatch Event

어플리케이션이 실행 되면 Main Event Loop에 대한 인프라를 설정한 다음

Low level 유저 Event의 전달을 담당하는 기본 시스템 컴포넌트와 Main Event Loop를 연결하는 설정 작업을 거친다.

> 아마도 Application 객체가 이러한 일을 담당하고 있는 것 같음.
> 

어플리케이션은 메인 스레드 Run Loop의 input source를 통해 여러 Event를 수신받는다

어플리케이션은 Event를 하나하나 개별적으로 처리해야 하므로 발생한 이벤트들을 도착 순으로

FIFO 구조의 **이벤트 Queue**에 배치함

**Application 객체**는 이런 이벤트 Queue에서 최상위에 위치한 이벤트를 가져와 **UIEvent** 객체로 변환하고

변환한 UIEvent 객체를 처리하기 위해 다른 적절한 객체로 전달함

> 적절한 객체란 window 객체를 통해 first responder 객체로 보내는 것 같음
> 

이렇게 전달된 UIEvent 객체를 전달하고 난 뒤 처리가 되면 이벤트 Queue에서 다음 이벤트를 가저와 UIEvent로 변환, 전달하는 작업을 Application이 종료될 때 까지 반복한다

## Core Object Respond to Events And Draw the UI

application이 실행되면 앞서 설명한 Main Event Loop에 대한 설정과 함께 

**UI를 보여주고 이벤트를 처리**하는 **Core Object Group**도 함께 설정하는 작업을 한다

Core Object Group에는 Window객체와 여러 종류의 View, ViewController도 포함됨

앞서 Application 객체가 UIEvent 객체를 다른 적절한 객체로 전달한다고 하였는데

다른 객체가 바로 해당 Event가 발생한 Window 객체이다.

Window 객체는 이 이벤트를 다시 처리하기 가장 적절한 (first responder라 불리는)View로 보낸다

이벤트를 전달받은 View가 이벤트(UIEvent 객체)를 처리하지 않으면 처리되지 않은 이벤트는 **Responder Chain**을 통해 다른 View로 전달하게 된다

이벤트를 Handle(처리)하게 되면 Application의 state, data를 업데이트하는 작업을 시작하고

작업이 완료되면 Application 객체로 control이 반환되고 Application 객체는 다시 Event Queue에서 이벤트를 꺼내 UIEvent객체로 변환, Window 객체로 전달 → UIEvent객체 처리 하는 과정을 반복 한다.


## 참고

[Apple](https://developer.apple.com/library/archive/documentation/General/Conceptual/Devpedia-CocoaApp/MainEventLoop.html#//apple_ref/doc/uid/TP40009071-CH18-SW1)
