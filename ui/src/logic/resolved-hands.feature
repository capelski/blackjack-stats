Feature: Resolved hands

  The resolved hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Resolved hands for stand threshold
    When getting the resolved hands of a hand resolver with a stand threshold of 17
    Then 30 resolved hands are returned
    And the resolved hand 1 has label "2/12", action "Hit" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.4309989442283621  | 0.10133718449414611  | 0.4676638712774668  | -0.03666492704910468  |
    And the resolved hand 30 has label "22+", action "Stand" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0                   | 0                    | 0.9999999999999751  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "Hit" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.23643754785128446 | 0.055591587238910015 | 0.7079708649097806  | -0.4715333170584962   |

  Scenario: Resolved hands for optimal roi
    When getting the resolved hands of a hand resolver for optimal roi
    Then 30 resolved hands are returned
    And the resolved hand 1 has label "2/12", action "Hit" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.44988190522271815 | 0.08907669491247122  | 0.46104139986478565 | -0.011159494642067648 |
    And the resolved hand 30 has label "22+", action "Stand" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0                   | 0                    | 0.9999999999999751  | -0.9999999999999751   |
    And the resolved hand with label "15" has action "Stand" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.24121013983516376 | 0.05162075957898787  | 0.7071691005858234  | -0.4659589607506597   |

  Scenario: Resolved hands for optimal roi with doubling
    Given doubling is allowed
    When getting the resolved hands of a hand resolver for optimal roi
    Then the resolved hand with label "10" has action "Double" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.48978422853219344 | 0.10606979663493174  | 0.4041459748328498  | 0.08563825369934373   |
      | Double | 0.48931862386555103 | 0.09321747278891154  | 0.4174639033455124  | 0.14370944104007735   |

  Scenario: Resolved hands for optimal roi with splitting
    Given splitting is allowed
    When getting the resolved hands of a hand resolver for optimal roi
    Then 106 resolved hands are returned
    And the resolved hand with label "A,A" has action "Split" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.44988190522271815 | 0.08907669491247122  | 0.46104139986478565 | -0.011159494642067648 |
      | Split  | 0.5309153370754748  | 0.0684047588884379   | 0.4006799040360623  | 0.2604708660788249    |

  Scenario: Resolved hands for optimal roi with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the resolved hands of a hand resolver for optimal roi
    And the resolved hand with label "A,A" has action "Split" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.44988190522271815 | 0.08907669491247122  | 0.46104139986478565 | -0.011159494642067648 |
      | Split  | 0.593743821960981   | 0.094291866698153    | 0.3119643113408412  | 0.5635590212402795    |

  Scenario: Resolved hands for optimal roi with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the resolved hands of a hand resolver for optimal roi
    And the resolved hand with label "8,8" has action "Split" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.2195491515761927  | 0.05162075957898787  | 0.7288300888447944  | -0.5092809372686018   |
      | Double | 0.2195491515761927  | 0.05162075957898787  | 0.7288300888447944  | -1.0185618745372036   |
      | Split  | 0.3838358308731666  | 0.09161420437422658  | 0.5245499647525819  | -0.2814282677588305   |

  Scenario: Resolved hands for optimal roi with doubling after splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the resolved hands of a hand resolver for optimal roi
    And the resolved hand with label "8,8" has action "Split" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.2195491515761927  | 0.05162075957898787  | 0.7288300888447944  | -0.5092809372686018   |
      | Double | 0.2195491515761927  | 0.05162075957898787  | 0.7288300888447944  | -1.0185618745372036   |
      | Split  | 0.3837641993859908  | 0.08963692378253117  | 0.526598876831453   | -0.25457856203562423  |
