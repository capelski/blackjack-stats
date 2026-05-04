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
    When getting the resolved hands of a hand resolver for optimal roi with doubling
    Then the resolved hand with label "10" has action "Double" and the following actions breakdown
      | Action | Win                 | Push                 | Lose                | Edge                  |
      | Stand  | 0.2815928473666239  | 0                    | 0.7184071526333512  | -0.4368143052667273   |
      | Hit    | 0.48978422853219344 | 0.10606979663493174  | 0.4041459748328498  | 0.08563825369934373   |
      | Double | 0.48931862386555103 | 0.09321747278891154  | 0.4174639033455124  | 0.14370944104007735   |
