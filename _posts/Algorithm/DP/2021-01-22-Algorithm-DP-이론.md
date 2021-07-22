---
title: 동적계획법(DP) 이론
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
popular: true
toc: true
toc_sticky: true
toc_label: 목차
categories:
- Algorithm
tag:
- DP
---

## 동적계획법이란?

 * 최적화 문제를 연구하는 수학이론에서 왔다.
 * 처음 주어진 문제를 더 작은 문제로 나눈 뒤 조각의 답을 계산하고 이러한 답들로 원래 문제에 대한 답을 계산, 도출
 * 어떤 부분문제는 두개 이상의 문제를 푸는데 사용할 수 있어 한번만 계산하고 계산 결과를 **재활용하여** 속도의 향상을 얻는다
 * 계산한 값을 저장하는 곳을 **캐시**라고 한다.
 * 이러한 한번만 계산한 값을 재활용 하는 최적화 기법을 **메모이제이션** 이라고 한다.
