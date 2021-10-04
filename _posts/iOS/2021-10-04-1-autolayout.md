---
title: "[iOS] Autolayout"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- Autolayout
- StackVIew
toc: true
toc_sticky: true
toc_label: 목차
---
# Autolayout

자동으로 레이아웃을 적합하게 그려줌

Autolayout의 핵심 요소는 2가지이다

1. 어디에 그려야할지 위치를 알아야함
2. 어떠한 크기로 그려야하는지 크기를 알아야함

이때 위치를 앵커로 조절가능 함

왼쪽은 leading, 오른쪽은 tailing으로 설정이 가능함

설정 시 constant 값을 3가지로 분류 가능함

- Equal
- Greater than Or Equal
- Less than Or Equal

## 우선 순위

각 컨스트레인트에는 우선순위가 있음

만약 각 컨스트레인트에서 충돌이 발생한다고 가정을 해보자.

![autolayout1.png](/assets/images/Posts/iOS/2021-10-04-autolayout/autolayout1.png)

전체 화면 길이가 300이라고 가정을 한 뒤

leading의 길이를 100, trailing의 길이를 100, 그리고 View의 길이를 200으로 하면

충돌이 발생할 것이다.

이때 컨스트레인트의 우선순위를 가지고 우선적으로 적용시킬지를 판단하게 된다

우선순위는 Priority 값으로 정하며 1000이 가장 높은 우선순위를 가진다

> default 값이 1000이다
> 
> 
> ![autolayout2.png](/assets/images/Posts/iOS/2021-10-04-autolayout/autolayout2.png)
> 

### View간의 우선순위

View간에도 우선순위를 설정할 수 있다.

2가지로 Hugging, Compression Resistance가 있다.

Hugging

뷰와 뷰간의 사이가 남을 때 어떤 뷰가 남는 공간을 채울건지?에 대한 조건이다

Content Hugging이 높으면 현상태를 유지하고 낮은 값의 뷰가 공간을 채우게 된다

Compression Resistance

Hugging과는 반대로 공간이 부족할 때, 어떤 뷰가 밀릴건지에 대한 조건이다

값이 높은 뷰가 원래 사이즈를 유지하고 낮은 뷰가 밀려나게 된다.

## StackView

설정에 따라 자동으로 StackView안의 컨텐츠들의 레이아웃을 조절한다

주요 설정 값으로

distribution이 Equally라면 모든 뷰가 동일한 사이즈를 가지며

만약 모든 뷰의 크기가 다르다면 가장 큰 뷰의 사이즈가 기준이 된다.

Fill이라면 내부 뷰의 사이즈를 각각 정해줘야 한다

spacing은 내부 뷰와 뷰 사이의 간격 값이다.

[StackView를 사용한 프로젝트](https://github.com/sweetfood-dev/CloneCoding/tree/main/StackViewProject)
