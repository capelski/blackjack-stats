Feature: Resolved hands

  The resolved hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Resolved hands for stand threshold
    When getting the resolved hands of a hand resolver with a stand threshold of 17
    Then 128 resolved hands are returned
    And the resolved hand 1 has label "A,A", action "hit" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.4309989442283621  | 1=0.10133718449414611  | 1=0.4676638712774668  | -0.03666492704910468  |
    And the resolved hand 128 has label "22+ (3+)", action "stand" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0                   | 1=0                    | 1=0.9999999999999751  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "hit" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.23643754785128446 | 1=0.055591587238910015 | 1=0.7079708649097806  | -0.4715333170584961   |

  Scenario: Resolved hands for optimal actions
    When getting the resolved hands of a hand resolver for optimal actions
    Then the resolved hand 1 has label "A,A", action "hit" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.44988190522271815 | 1=0.08907669491247122  | 1=0.46104139986478565 | -0.011159494642067502 |
    And the resolved hand 128 has label "22+ (3+)", action "stand" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0                   | 1=0                    | 1=0.9999999999999751  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "stand" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.24121013983516376 | 1=0.05162075957898787  | 1=0.7071691005858234  | -0.4659589607506596   |

  Scenario: Resolved hands for optimal actions with doubling
    Given doubling is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    Then the resolved hand with label "10" has action "double" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.48978422853219344 | 1=0.10606979663493174  | 1=0.4041459748328498  | 0.08563825369934364   |
      | double | 2=0.48931862386555103 | 2=0.09321747278891154  | 2=0.4174639033455124  | 0.1437094410400772    |

  Scenario: Resolved hands for optimal actions with splitting
    Given splitting is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    Then the resolved hand with label "A,A" has action "split" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.44988190522271815 | 1=0.08907669491247122  | 1=0.46104139986478565 | -0.011159494642067502 |
      | split  | 2=0.5309153370754748  | 2=0.0684047588884379   | 2=0.4006799040360623  | 0.26047086607882497   |

  Scenario: Resolved hands for optimal actions with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "A,A" has action "split" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.44988190522271815 | 1=0.08907669491247122  | 1=0.46104139986478565 | -0.011159494642067502 |
      | split  | 2=0.593743821960981   | 2=0.094291866698153    | 2=0.3119643113408412  | 0.5635590212402796    |

  Scenario: Resolved hands for optimal actions with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "8,8" has action "split" and the following actions breakdown
      | Action | Win                   | Push                   | Lose                  | Edge                  |
      | stand  | 1=0.2815928473666239  | 1=0                    | 1=0.7184071526333512  | -0.4368143052667273   |
      | hit    | 1=0.2195491515761927  | 1=0.05162075957898787  | 1=0.7288300888447944  | -0.5092809372686017   |
      | double | 2=0.2195491515761927  | 2=0.05162075957898787  | 2=0.7288300888447944  | -1.0185618745372034   |
      | split  | 2=0.3838358308731666  | 2=0.09161420437422658  | 2=0.5245499647525819  | -0.28142826775883056  |

  Scenario: Resolved hands for optimal actions with doubling after splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "8,8" has action "split" and the following actions breakdown
      | Action | Win                                          | Push                                          | Lose                                        | Edge                  |
      | stand  | 1=0.2815928473666239                         | 1=0                                           | 1=0.7184071526333512                        | -0.4368143052667273   |
      | hit    | 1=0.2195491515761927                         | 1=0.05162075957898787                         | 1=0.7288300888447944                        | -0.5092809372686017   |
      | double | 2=0.2195491515761927                         | 2=0.05162075957898787                         | 2=0.7288300888447944                        | -1.0185618745372034   |
      | split  | 2=0.30528466392898884,4=0.07847953545700198  | 2=0.07720444442273505,4=0.012432479359796113  | 2=0.46366473780210105,4=0.06293413902935191 | -0.2545785620356241   |

  Scenario: Resolved hands for optimal actions with blackjack after split
    Given splitting is allowed
    And blackjack after split is allowed
    When getting the resolved hands of a hand resolver for optimal actions
    And the resolved hand with label "A,A" has action "split" and the following actions breakdown
      | Action | Win                                        | Push                                          | Lose                     | Edge                  |
      | stand  | 1=0.2815928473666239                       | 1=0                                           | 1=0.7184071526333512     | -0.4368143052667273   |
      | hit    | 1=0.44988190522271815                      | 1=0.08907669491247122                         | 1=0.46104139986478565    | -0.011159494642067502 |
      | split  | 2=0.2601670114695724,3=0.2931269913518358  | 2=0.04602609314250452,3=0.014565316340464275  | 2=0.3861145876955981,3=0 | 0.6274858216034559    |
