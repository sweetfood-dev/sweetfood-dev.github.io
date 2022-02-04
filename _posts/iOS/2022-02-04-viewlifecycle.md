---
title: "[iOS] UIView LifeCycle"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- LifeCycle
- View
toc: true
toc_sticky: true
toc_label: 목차
---

UIView는 직사각형 영역에 대한 Contents를 관리하는 객체이며

레이블, 버튼, 이미지와 같은 하위 View를 가질 수 있음

## Lifecycle Method

### init()

parameter가 있거나 없는 Custom 이니셜라이저

### init(frame:)

지정된 frame으로 view를 초기화 하고 반환

frame의 origin은 상위 view를 기준으로 함

### init(coder:)

스토리 보드 / nib 파일에서 view를 불러오는 경우에 추가로 초기화가 필요한 경우 구현하여 사용

### updateConstraints()

view의 제약 조건을 업데이트함

이 시점에서 view의 frame / bounds가 결정됨

### layoutSubViews()

시스템은 superView → subView로 순회하며 이 메소드를 호출함

updateConstraints에서 결정된 frame을 기반으로 subView를 배치함

## 호출 순서

![](/assets/images/Posts/iOS/2022-02-04-viewlifecycle/viewmethodProcess.jpeg)
