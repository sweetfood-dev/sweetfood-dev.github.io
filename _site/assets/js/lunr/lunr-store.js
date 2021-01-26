var store = [{
        "title": "[백준 11726] 2 * n 타일링",
        "excerpt":"링크   문제   2×n 크기의 직사각형을 1×2, 2×1 타일로 채우는 방법의 수를 구하는 프로그램을 작성하시오.   아래 그림은 2×5 크기의 직사각형을 채운 한 가지 방법의 예이다.   입력     첫째 줄에 n이 주어진다. (1 ≤ n ≤ 1,000)    출력     첫째 줄에 2×n 크기의 직사각형을 채우는 방법의 수를 10,007로 나눈 나머지를 출력한다.    코드  func solve(n : Int) { \tguard n &gt; 2 else { return n } \tvar arr = [Int](repeating: 0, count: n + 1) \tarr[1] = 1 \tarr[2] = 2 \tfor i in 3 ... n { \t\tarr[i] = arr[i - 1] + arr[i - 2] \t\tarr[i] %= 10007 \t} \t \treturn arr[i] }   풀이 : 조금 더 이해가 되면 작성할 예정  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/11726-2-n/",
        "teaser": null
      },{
        "title": "동적계획법(DP) 이론",
        "excerpt":"동적계획법이란?      최적화 문제를 연구하는 수학이론에서 왔다.   처음 주어진 문제를 더 작은 문제로 나눈 뒤 조각의 답을 계산하고 이러한 답들로 원래 문제에 대한 답을 계산, 도출   어떤 부분문제는 두개 이상의 문제를 푸는데 사용할 수 있어 한번만 계산하고 계산 결과를 재활용하여 속도의 향상을 얻는다   계산한 값을 저장하는 곳을 캐시라고 한다.   이러한 한번만 계산한 값을 재활용 하는 최적화 기법을 메모이제이션 이라고 한다.  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/Algorithm-DP-%EC%9D%B4%EB%A1%A0/",
        "teaser": null
      },{
        "title": "[백준 11727] 2 * n 타일링2",
        "excerpt":"링크 문제   2×n 직사각형을 1×2, 2×1과 2×2 타일로 채우는 방법의 수를 구하는 프로그램을 작성하시오.   입력     첫째 줄에 n이 주어진다. (1 ≤ n ≤ 1,000)    출력     첫째 줄에 2×n 크기의 직사각형을 채우는 방법의 수를 10,007로 나눈 나머지를 출력한다.    앞에 타일링 문제에서 2 * 2 타일이 추가되었을 뿐 개념은 같다 (n - 1)  + (n - 2) * 2 &gt; 2 * 2 타일은 결국 ( n - 2 ) 타일과 같다   func solve(n : Int) -&gt; Int {     if n == 0 { return 0}     if n == 1 { return 1}     if n == 2 { return 3}     var arr = [Int](repeating: 0, count : n + 1)      arr[1] = 1     arr[2] = 3     for i in 3 ... n {         arr[i] = arr[i - 1] + (arr[i - 2] * 2)         arr[i] %= 10007     }     return arr[n] }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ11727-DP/",
        "teaser": null
      },{
        "title": "[백준 1463] 1로 만들기",
        "excerpt":"링크   문제   정수 X에 사용할 수 있는 연산은 다음과 같이 세 가지 이다.     X가 3으로 나누어 떨어지면, 3으로 나눈다.   X가 2로 나누어 떨어지면, 2로 나눈다.   1을 뺀다.            정수 N이 주어졌을 때, 위와 같은 연산 세 개를 적절히 사용해서 1을 만들려고 한다. 연산을 사용하는 횟수의 최솟값을 출력하시오.            입력     첫째 줄에 1보다 크거나 같고, 106보다 작거나 같은 정수 N이 주어진다.    출력     첫째 줄에 연산을 하는 횟수의 최솟값을 출력한다.    시도 1 :  메모이제이션을 사용한 재귀로 구현.   var cache = [Int](repeating: 0, count: 1000001)  func solve(x: Int) -&gt; Int { \tguard x &gt;= 1 else { return 0 } \tif x == 1 { return 1 } \tif cache[x] &gt; 0 { \t\treturn cache[x] \t} \tvar minVal = Int.max \tminVal = min(solve(x: x - 1), minVal) \tif x % 3 == 0 { minVal = min(solve(x: x / 3), minVal) }  \tif x % 2 == 0 { minVal = min(solve(x: x / 2), minVal) } \tcache[x] = minVal + 1 \treturn minVal + 1 \t}  if let x = Int(readLine()!) { \tprint(solve(x: x) - 1) }   x가 10000 이하일때는 잘 동작했지만 그 이상이 되면 재귀의 깊이가 깊어져 런타임 에러 발생.   고민고민을 해봤지만 고민만 1시간이 넘어가 결국 구글링…   재귀가 아닌 상향식 DP를 사용하여 접근하는 방법이 많았다   일련의 규칙이 있는데   x == 1 ,  0  , 연산 필요 없음 x == 2 , ( 2 / 2 ) = 1, 1번 연산 x == 3,  ( 3 / 3 ) = 1, 1번 연산 x == 4,  ( 4 / 2 ) = 2, (2 / 2) = 1, 총 2번 연산 x == 5 , ( 5 - 1 ) =  4 , ( 4 / 2 ) = 2, ( 2 / 2 ) = 1, 총 3번 연산   x 가 4 이상 일 때는 이 전의 결과를 포함하고 있다 .   이를 코드로 나타내면    func solve(x: Int) -&gt; Int {     if x == 1 { return 0 }     else if x == 2 { return 1 }     else if x == 3 { return 1 }     else{         var cache = [Int](repeating: 0, count: x + 1)         cache[1] = 0         cache[2] = 1         cache[3] = 1                  for i in 4 ... x {             cache[i] = cache[i - 1] + 1             if i % 3 == 0 {                 cache[i] = min(cache[i / 3] + 1, cache[i])             }             if i % 2 == 0 {                 cache[i] = min(cache[i / 2] + 1, cache[i])             }         }         return cache[x]     } } if let x = Int(readLine()!) {     print(solve(x: x)) }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ1463-DP/",
        "teaser": null
      },{
        "title": "[백준 9095] 1, 2, 3 더하기",
        "excerpt":"링크   문제   정수 4를 1, 2, 3의 합으로 나타내는 방법은 총 7가지가 있다. 합을 나타낼 때는 수를 1개 이상 사용해야 한다.      1+1+1+1   1+1+2   1+2+1   2+1+1   2+2   1+3   3+1   정수 n이 주어졌을 때, n을 1, 2, 3의 합으로 나타내는 방법의 수를 구하는 프로그램을 작성하시오.   입력     첫째 줄에 테스트 케이스의 개수 T가 주어진다. 각 테스트 케이스는 한 줄로 이루어져 있고, 정수 n이 주어진다. n은 양수이며 11보다 작다.    출력     각 테스트 케이스마다, n을 1, 2, 3의 합으로 나타내는 방법의 수를 출력한다.    풀이 :  1~3의 합으로 정수 N을 나타내는 경우의 수만 구하면된다,  구성은 상관없다는 소리.   N == 1 일 때 경우의 수 :   1  N == 2 일 때 경우의 수 :   1 + 1  2  N == 3 일 때 경우의 수 :   1 + 1 + 1  1 + 2  2 + 1  3   일 때,     N == 4는 다음과 같다   N == 4 :    1 + 1 + 1 + 1 :     3의 경우의 수 + 1    1 + 1 + 2 :             2의 경우의 수 + 2   1 + 2+ 1 :             3의 경우의 수 + 1   2 + 1 + 1 :             3의 경우의 수 + 1   2 + 2 :                     2의 경우의 수 + 2   1 + 3 :                     1의 경우의 수 + 3   3 + 1 :                     3의 경우의 수 + 1    1의 경우의 수 + 2의 경우의 수 + 3의 경우의 수 의 합과 같다.  수식으로 표현하면 N = (N - 3) + (N - 2) + (N - 1) 이므로 이를 그대로 사용!    func solve(n : Int) -&gt; Int{     if n == 0 { return 0 }     else if n == 3 { return 4 }     else if n == 2 { return 2 }     else if n == 1 { return 1 }     var arr = [Int](repeating:0, count: n + 1)     arr[1] = 1     arr[2] = 2     arr[3] = 4     for i in 4 ... n {         arr[i] = arr[i - 3] + arr[i - 2] + arr[i - 1]     }     return arr[n] }  var map = [Int:Int]() map[0] = 0 map[1] = 1 map[2] = 2 map[3] = 4 func recursive(n : Int) -&gt; Int {     if let res = map[n] {         return res     }          map[n] = recursive(n: n - 3) + recursive(n: n - 2) + recursive(n: n - 1)     return map[n]! } if let count = Int(readLine()!){          for _ in 0 ..&lt; count {         let n = Int(readLine()!)!         // 상향식         /*print(solve(n: n))*/         // 하향식         print(recursive(n: n))     } }   상향식과 하향식 모두 가능!  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ9095-DP/",
        "teaser": null
      },{
        "title": "arc 공부해서 수정",
        "excerpt":"ㅇㅇ  ","categories": ["iOS"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/ios/iOS-ARC-%EC%A0%95%EB%A6%AC/",
        "teaser": null
      },{
        "title": "[백준 10844] 쉬운 계단 수",
        "excerpt":"링크   문제 45656이란 수를 보자.   이 수는 인접한 모든 자리수의 차이가 1이 난다. 이런 수를 계단 수라고 한다.   세준이는 수의 길이가 N인 계단 수가 몇 개 있는지 궁금해졌다.   N이 주어질 때, 길이가 N인 계단 수가 총 몇 개 있는지 구하는 프로그램을 작성하시오. (0으로 시작하는 수는 없다.)   입력     첫째 줄에 N이 주어진다. N은 1보다 크거나 같고, 100보다 작거나 같은 자연수이다.    출력     첫째 줄에 정답을 1,000,000,000으로 나눈 나머지를 출력한다.    풀이   N == 1 일 때, 계단 수 : 1,2,3,4,5,6,7,8,9  N == 2 일 때, 계단 수 : 10,12, 21, 23, 32, 34, 43, 45, 54, 56, 65, 67, 76, 78, 87, 89, 98    규칙을 찾아 보자  N == 1 일 때, 계단 수 에서 N == 2일 때, 계단 수를 구할 수 있을까?  N == 2 일 때, 계단수 10, 12를 봐보자   N == 2 일 때, 10과 12는 N == 1 일 때, 1에서 0 과 2를 1의 자리에 넣어 준 것과 같다  N == 2 일 때, 21과 23은 N == 1 일 때, 2에서 1과 3을 1의 자리에 넣어 준 것과 같다.  N == 2 일 때의 계단 수는 N == 1일 때 계단 수에서 1의 자리에서 +1과, -1을 해준 숫자들이 들어감을 확인할 수 있다  N == 2 일 때, 10과 12는 N == 1 일 때, 1에  1 - 1, 즉 0을 붙여 10, 1 에 1 + 1, 즉 2를 붙여 12가 만들어 짐을 알 수 있다.  이를 이용하면 N이 주어질 때 마지막 1의 자리가 K인 숫자의 계단 수의 갯수는  N - 1 번째의 K - 1의 계단 수의 갯수 + N - 1번째의 K + 1의 계단수의 갯수일 것이다  예를 들어 N == 2 일 때 1의 자리 숫자가 3으로 끝나는 계단 수의 갯수는   N == 1 일 때, 2의 갯수,  그리고 4의 갯수를 합치면 된다  글 보다 표를 그려 확인 해보자     수식으로 구성 해보자   N : 숫자의 길이, K : N 의 계단 수의 1의 자리   N[K] = N-1[K - 1] + N-1[K+1] 이 때, 주의 할 것이 있다   N[K] == 0 일 경우엔  이전 단계에서 1일 경우만 더해주고 ( 즉, N-1[1])  K == 9 : 8일 경우만 더해 준다 ( 즉 N-1[8])     이를 그대로 코드로 옮겨 보자   func solve(n : Int) {     if n == 1 { // 1일 경우는 무조건 9개 밖에 없다         print(9)         return     }     let mod = 1_000_000_000 // 결과값에서 쓰일 나머지 연산 값      var map = Array(repeating: Array(repeating: 0, count: 10), count: 101)          for i in 1 ... 9 {         map[1][i] = 1     }          for i in 2 ... n {         map[i][0] = map[i-1][1]         map[i][9] = map[i-1][8]         for k in 1 ... 8 {             map[i][k] = (map[i-1][k - 1] + map[i-1][k + 1]) % mod         }     }          let result = map[n].reduce(0,+)          print(result % mod) }  ","categories": ["Algorithm","DP"],
        "tags": [],
        "url": "https://sweetfood-dev.github.io/algorithm/dp/BOJ10844-DP/",
        "teaser": null
      }]
