---
title: "[iOS] UITableView dequeueReusableCell"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- TableView
toc: true
toc_sticky: true
toc_label: 목차
---

문득 궁금해짐

```swift
dequeueReusableCell(withIdentifier: String)
dequeueReusableCell(withIdentifier: String, for indexPath: IndexPath)

```

2가지의 차이가 뭔지.

가장 중요한 차이는 반환값이다

withIdentifier: 버전의 메소드는 nil을 리턴할 수 있지만

withIdentifier:,for: 버전의 메소드는 nil을 리턴할 수 없음

즉  셀의 식별자나 nib파일이 등록되어 있지 않으면

indexPath를 넘기는 버전의 메소드는 바로 충돌이 발생

WWDC2012에서 항상 초기화된 셀을 얻게 될것이라는 발언을 한적이 있다.

즉 nil을 반환하지 않는다는 이야기이고

해당 WWDC 컨퍼런스에서 withIdentifier:,for: 메소드는 셀이 해당 IndexPath에 적절한 크기가

될 것이라고도 언급을 하였음

추측하기로는 heightForRowAtIndexPath 메서드를 호출하여

반환하기 전에 셀의 크기를 설정하는 것을 의미하는 것 같음

이것이 이 메소드에 indexPath가 필요한 이유이지 않을까?

[참조]](https://stackoverflow.com/questions/25826383/when-to-use-dequeuereusablecellwithidentifier-vs-dequeuereusablecellwithidentifi)
