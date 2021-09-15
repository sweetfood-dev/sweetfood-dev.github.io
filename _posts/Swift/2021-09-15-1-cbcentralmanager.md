---
title: "[iOS] CoreBluetooth - CentralManager"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- iOS
tag:
- CoreBluetooth
toc: true
toc_sticky: true
toc_label: 목차
---

## CentralManager

중앙관리자는 **주변 장치 스캔**을 할 수 있으며

앱이 실행되고 있는 기기의 **블루투스 상태를 모니터링** 할 수 있다

```swift
let centralManager = CBCentralManager(delegate: self, queue: nil)
```

delegate : **CBCentralManagerDelegate** 프로토콜을 구현한 타입의 인스턴스

queue: CentralManager 인스턴스가 활동할 대기열

### CentralManager 모니터링

CBCentralManagerDelegate 프로토콜의 centralManagerDidUpdateState(_:) 사용

```swift
class or extension 타입: CBCentralManagerDelegate {
    centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state { ... }
    }
}
```

디바이스와 앱 내의 블루투스 상태가 업데이트 될 때마다 CoreBluetooth를 통하여 호출 되는 델리게이트 메서드

CBCentralManager 인스턴스가 생성, 초기화 후에 centralManagerDidUpdate가 바로 호출된다.

정상적인 상황에서는 매개변수로 넘어온 central 인스턴스의 state 프로퍼티의 값이 .poweredOn 이다

- state 목록
1. .poweredOff : 블루투스 기능이 해제, 기기의 제어센터 / 설정에서 블루투스 기능을 활성화 시켜야한다
2. .poweredOn : 블루투스 기능이 활성화 된 상태이며 앱에서 블루투스 기능을 사용할 수 있는 상태이다
3. .resetting : 블루투스 서비스와의 연결이 중단 된 상태
4. .unauthorized : 사용자가 블루투스 권한 요청을 거부한 상태로 앱의 설정에서 직접 활성화 해야함
5. .unknown : 블루투스 서비스에 대한 중앙관리자와 앱의 연결상태를 알 수 없는 경우
6. .unsupport : 기기가 블루투스를 지원하지 않음

### Scanning for peripherals

중앙 관리자는 주변 기기를 탐색할 수 있다

centralManagerDidUpdateState(_ central: CBCentralManager) 델리게이트 메소드에서 

central.state 값이 .poweredOn 상태라면 탐색 시작이 가능하다

**중앙관리자 인스턴스**에서 **scanForPeripherals(withService:,options:) 메서드를 호출**하여 탐색을 시작한다

```swift
func centralManagerDidUpdateState(_ central: CBCentralManager) {
    switch central.state { 
    case .poweredOn:
        central.scanForPeripherals(withServices: nil, options: nil)
    ...
    }
}
```

**withServices :[CBUUID]?**

옵셔널 CBUUID 배열로 찾고자 하는 UUID를 필터링할 수 있다

**options: [String : Any]?**

다음 나열된 키 중 0개 이상이 포함된 딕셔너리를 사용하여 전달할 수 있음

1. **CBCentralManagerScanOptionAllowDuplicatesKey**

Bool 타입을 값으로 가짐

true일 경우 처음 수신된 광고 패킷이 아닌 지정된 장치의 모든 탐지된 광고 패킷에 대해 델리게이트 호출을 수행

> 즉, 광고 패킷을 처음 수신 받고 더 이상 받지 않는 것이 아니라 지속적으로 수신을 받음

기본 값은 false이다

apple은 배터리와 메모리 성능에 악영향을 미치기 때문에 false를 권장함

1. **CBCentralManagerScanOptionSolicitedServiceUUIDsKey**

중앙 관리자가 클라이언트 대신 Gatt 서버 역할을 하는 GAD 중앙부에 GAD 주변장치를 광고하는 경우 유용

> 사실 무슨말인지 잘 이해가 안간다

scanForPeripherals 호출 후 중앙관리자는 CBCentralManagerDelegate 프로토콜의

centralManager(_:, didDiscover:,advertisementData: rssi:) 델리게이트 메서드를 호출

scanForPeripherals의 withServices 인자에 [CBUUID]를 전달했다면 해당 서비스 UUID를 하나 이상 가지고 있는 주변 장치를 전달 받음

### Scan Result

```swift
/// scanForPeripherals(withServices:, options) 메소드 호출 후 탐지된 광고 패킷을 받는 메서드
/// - Parameters:
///   - central: 해당 장치를 발견한 중앙 관리자 객체
///   - peripheral: 발견된 주변장치
///   - advertisementData: 광고된 패킷에 포함된 data 딕셔너리, CoreBluetooth는 기본 키세트를 사용하여 이 데이터를 분석하고 구성함
///   - RSSI: 수신된 광고 패킷의 신호 강도, -30 ~ -99 범위를 가지며 -30이 제일 강한 강도
func centralManager(_ central: CBCentralManager,
	                  didDiscover peripheral: CBPeripheral,
	                  advertisementData: [String : Any],
	                  rssi RSSI: NSNumber)
```

위에서 설명했듯이 scanForPeripherals메소드 호출한 후 탐지된 광고 패킷은

CBCentralManagerDelegate 프로토콜의 델리게이트 메서드인 

centralManager(_:, didDiscover:,advertisementData: rssi:)에서 확인할 수 있음

이 델리게이트 메서드는 주변기기의 범위, 광고 상태, scanForPeripherals 메서드의 options 매개변수에 따라 호출 되는 빈도가 달라진다

### 정리

1. 중앙관리자는 주변 장치를 탐색하고, 앱을 사용하는 기기의 블루투스 상태를 모니터링하는 객체다
2. 모니터링은 중앙관리자 객체를 인스턴스 한 직후 CBCentralManagerDelegate 프로토콜의
**centralManagerDidUpdateState** 메서드가 호출 되며 현재 상태를 알 수 있으며, 상태가 변경될 때마다 이 메서드가 호출됨
3. 중앙관리자 인스턴스의 scanForPeripherals(withServices:, options:) 메서드를 사용하여 탐색을 시작
4. CBCentralManagedDelegate 프로토콜의 centralManaged(_: didDiscover: advertisementData:, rssi:) 메서드를 통해 탐색된 광고 패킷의 주변장치와 그외 정보를 전달 받는다

## 주변 장치와의 Connecting, Disconnecting

### Connecting

중앙 관리자 인스턴스에서 connect(_:, options:) 메서드를 호출하여 연결을 시도할 수 있음

```swift
중앙관리자인스턴스.connect(peripherals, options: nil)
```

- peripherals : CBPeripheral 인스턴스
- options: [String : Any] 타입의 딕셔너리  [(Peripheral Connection Options 참조)](https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/peripheral_connection_options)

연결 성공 시 CBCentralManagerDelegate 프로토콜

**central(_:, didConnect:)** 델리게이트 메서드 호출 

```swift
/// 연결이 성공 되었을 때 호출 되는 델리게이트 메서드
/// - Parameters:
///   - central: 중앙관리자
///   - peripheral: 연결된 주변기기
func centralManager(_ central: CBCentralManager,
                    didConnect peripheral: CBPeripheral) { }
```

연결 실패 시 CBCentralManagerDelegate 프로토콜 

**central(_: didFailToConnect:, error:)** 델리게이트 메서드 호출

```swift
/// 연결이 실패 했을 때 호출되는 델리게이트 메서드
/// - Parameters:
///   - central: 중앙관리자
///   - peripheral: 연결 시도하였으나 실패한 주변기기
///   - error: 실패 이유(에러)
func centralManager(_ central: CBCentralManager,
                    didFailToConnect peripheral: CBPeripheral,
                    error: Error?) { }
```

범위를 벗어난 특정 주변장치에 대해 연결 요청도 할 수 있다.

> 해당 주변 장치의 정보를 미리 가지고 있다면

이런 경우 iOS는 블루투스가 중지되거나 앱을 수동으로 종료하지 않는 한

**central(_:, didConnect:) 가 호출될 때 까지 무기한 대기하게 된다.**

### Disconnecting

중앙관리자 인스턴스의

**cancelPeripheralConnection(_:)** 메서드 호출

```swift
중앙관리자인스턴스.cancelPeripheralConnection(periphearals)
```

> 주변 장치의 모든 참조를 제거하면 암시적으로 cancelPeripheralConnection를 호출한다고 하였으나
테스트를 해보진 않았음

cancelPeripheralConnection(_:)를 호출에 대한 결과는 CBCentralManagerDelegate 프로토콜의

```swift
/// 연결 해제 시도 후 호출되는 델리게이트 메서드
/// - Parameters:
///   - central: 중앙 관리자
///   - peripheral: 연결 해제된 주변 장치
///   - error: 해제 실패시 오류 내용이 담겨짐
func centralManager(_ central: CBCentralManager,
                    didDisconnectPeripheral peripheral: CBPeripheral,
                    error: Error?) {
    if let error = error {
        print("disConnected Error \(error.localizedDescription)")
        return
    }
}
```

델리게이트 메서드로 전달된다.

### 정리

1. 중앙관리자 인스턴스의 connect(_:, options:) 메서드를 호출하여 주변 장치로 연결을 시도할 수 있음 
2. 연결 성공 시 CBCentralManagerDelegate의 centralManager(_:, didConnecting:) 메서드 호출
3. 연결 실패 시 CBCentralManagerDelegate의 centralManager(_:, didFailToConnect:, error:) 메서드 호출 
4. 중앙관리자 인스턴스의 cancelPeripheralConnection(_:) 메서드를 호출하여 주변 장치와의 연결 해제 시도
5. 연결 해제 시도후 CBCentralManagerDelegate의 centralManager(_:, didDisconnecting:, error:) 메서드 호출 
