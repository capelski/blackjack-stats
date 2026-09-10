Feature: Expected results

  The expected results for both a given player score and the player overall are computed correctly

  Split hands are counted as one betting unit per side (each keeping the probability of the
  round it comes from), so the overall probability exceeds 1 when splitting is enabled

  Scenario: Individual expected result
    Then the following individual expected result scenarios are considered
      | Hand resolver      | Rules                                                              | Score | Modifiers                                | Win                   | Push                   | Lose                   |
      | 17 stand threshold | {}                                                                 | 17    | {}                                       | 0.04086641667628575   | 0.021061528158462465   | 0.08319795967048273    |
      | Optimal actions    | {}                                                                 | 15    | {}                                       | 0.03555751584572714   | 0                      | 0.09071527900062643    |
      | Optimal actions    | {"doubling": "all"}                                                | 20    | {}                                       | 0.10108526313939592   | 0.02604172368173089    | 0.017346652516897536   |
      | Optimal actions    | {"doubling": "all"}                                                | 20    | { "isDoubleBet": true }                  | 0.01146493711203572   | 0.0029536127723022733  | 0.0019674309986838986  |
      | Optimal actions    | {"splitting": true}                                                | 20    | {}                                       | 0.11311876079242225   | 0.029141809797871576   | 0.019411650874393997   |
      | Optimal actions    | {"splitting": true}                                                | 20    | { "isSplit": true }                      | 0.0010648985447070758 | 0.00027434061889018436 | 0.00018274102917761778 |
      | Optimal actions    | {"splitting": true, "hitSplitAces": true}                          | 20    | { "isSplit": true }                      | 0.0015377973963740283 | 0.0003961694675477397  | 0.0002638924433475974  |
      | Optimal actions    | {"doubling": "all", "splitting": true}                             | 20    | { "isDoubleBet": true }                  | 0.01146493711203572   | 0.0029536127723022733  | 0.0019674309986838986  |
      | Optimal actions    | {"doubling": "all", "splitting": true}                             | 20    | { "isSplit": true }                      | 0.0010648985447070758 | 0.00027434061889018436 | 0.00018274102917761778 |
      | Optimal actions    | {"doubling": "all", "splitting": true, "doublingAfterSplit": true} | 20    | { "isSplit": true, "isDoubleBet": true } | 0.0002449772887187121 | 0.00006311138402355288 | 0.00004203912390350213 |
      | Optimal actions    | {"splitting": true, "blackjackAfterSplit": true}                   | BJ    | { "isBlackjack": true }                  | 0.04509646020797474   | 0.002240817898532966   | 0                      |
      | Optimal actions    | {"splitting": true, "blackjackAfterSplit": true}                   | BJ    | { "isSplit": true, "isBlackjack": true } | 0.0034689584775365184 | 0.0001723706075794589  | 0                      |

  Scenario: Overall expected results
    Then the following overall expected results scenarios are considered
      | Hand resolver      | Rules                                                              | Probability        | Win                                                                | Push                                                                  | Lose                                                 | Edge                  |
      | 17 stand threshold | {}                                                                 | 0.9999999999999751 | 1=0.366078748016717,1.5=0.04509646020797474                        | 1=0.0961142339639908,1.5=0.002240817898532966                         | -1=0.49046973991273446,-1.5=0                        | -0.05674630158405536  |
      | Optimal actions    | {}                                                                 | 0.999999999999999  | 1=0.38106448841901663,1.5=0.04509646020797474                      | 1=0.08222734333350687,1.5=0.002240817898532966                        | -1=0.48937089014094276,-1.5=0                        | -0.04066171140996405  |
      | Optimal actions    | {"doubling": "all"}                                                | 0.9999999999999988 | 1=0.3356234402908378,1.5=0.04509646020797474,2=0.04539972227019323 | 1=0.07398743068072478,1.5=0.002240817898532966,2=0.007099173849880971 | -1=0.4542944544722016,-1.5=0,-2=0.03625850032962772  | -0.032743879988270774 |
      | Optimal actions    | {"splitting": true}                                                | 1.0118343195266262 | 1=0.3875616930539749,1.5=0.04509646020797474                       | 1=0.08359397784009184,1.5=0.002240817898532966                        | -1=0.4933413705260263,-1.5=0                         | -0.038134987160089284 |
      | Optimal actions    | {"splitting": true, "hitSplitAces": true}                          | 1.0118343195266264 | 1=0.388305225419484,1.5=0.04509646020797474                        | 1=0.08390033414553226,1.5=0.002240817898532966                        | -1=0.49229148185507693,-1.5=0                        | -0.036341566123630875 |
      | Optimal actions    | {"doubling": "all", "splitting": true}                             | 1.0118343195266262 | 1=0.342120644925796,1.5=0.04509646020797474,2=0.04539972227019323  | 1=0.07535406518730974,1.5=0.002240817898532966,2=0.007099173849880971 | -1=0.45826493485728537,-1.5=0,-2=0.03625850032962772 | -0.03021715573839623  |
      | Optimal actions    | {"doubling": "all", "splitting": true, "doublingAfterSplit": true} | 1.0118343195266264 | 1=0.3411910453169892,1.5=0.04509646020797474,2=0.04632847416909266 | 1=0.0751835354837418,1.5=0.002240817898532966,2=0.007246303783132995  | -1=0.4575443996271022,-1.5=0,-2=0.037003283040034245 | -0.03005828174003411  |
      | Optimal actions    | {"splitting": true, "blackjackAfterSplit": true}                   | 1.0118343195266262 | 1=0.38435757085745537,1.5=0.04856541868551126                      | 1=0.08332914155907488,1.5=0.0024131885061124247                       | -1=0.4931689999184468,-1.5=0                         | -0.03596330103272455  |
