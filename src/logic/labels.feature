Feature: Labels

  All relevant aspects of a hand are considered when generating the next label

  Scenario: Hitting an initial pair
    Given the hand label "12"
    When hitting with next card "3"
    Then the next hand label is "15 (3+)"

  Scenario: Hitting a 3+ cards
    Given the hand label "15 (3+)"
    When hitting with next card "10"
    Then the next hand label is "22+ (3+)"

  Scenario: Doubling an initial pair
    Given the hand label "11"
    When doubling with next card "3"
    Then the next hand label is "14 (D)"

  Scenario: Splitting a splittable pair
    Given splitting is allowed
    And the hand label "8,8"
    When splitting with next card "3"
    Then the next hand label is "11 (S1)"

  Scenario: Splitting a splittable pair (A,A)
    Given splitting is allowed
    And the hand label "A,A"
    When splitting with next card "3"
    Then the next hand label is "4/14 (A)"

  Scenario: Splitting a splittable pair into a pair that can no longer be split
    Given splitting is allowed
    And the hand label "8,8"
    When splitting with next card "8"
    Then the next hand label is "16 (S1)"

  Scenario: Splitting a splittable pair into another splittable pair
    Given splitting is allowed 2 times
    And the hand label "8,8"
    When splitting with next card "8"
    Then the next hand label is "8,8 (S1)"

  Scenario: Re-splitting a pair that has already been split
    Given splitting is allowed 3 times
    And the hand label "8,8 (S1)"
    When splitting with next card "8"
    Then the next hand label is "8,8 (S2)"

  Scenario: Re-splitting a pair for the last time
    Given splitting is allowed 2 times
    And the hand label "8,8 (S1)"
    When splitting with next card "3"
    Then the next hand label is "11 (S2)"

  Scenario: Splitting aces into a re-splittable pair of aces
    Given splitting is allowed 2 times
    And hitting split aces is allowed
    And the hand label "A,A"
    When splitting with next card "A"
    Then the next hand label is "A,A (A)"

  Scenario: Splitting aces into a pair of aces that can no longer be split
    Given splitting is allowed 2 times
    And the hand label "A,A"
    When splitting with next card "A"
    Then the next hand label is "2/12 (A)"

  Scenario: Re-splitting aces
    Given splitting is allowed 3 times
    And hitting split aces is allowed
    And the hand label "A,A (A)"
    When splitting with next card "A"
    Then the next hand label is "A,A (S2)"

  Scenario: Re-splitting aces into a hand that is not a pair
    Given splitting is allowed 3 times
    And hitting split aces is allowed
    And the hand label "A,A (A)"
    When splitting with next card "3"
    Then the next hand label is "4/14 (S2)"

  Scenario: Re-splitting aces for the last time
    Given splitting is allowed 3 times
    And hitting split aces is allowed
    And the hand label "A,A (S2)"
    When splitting with next card "A"
    Then the next hand label is "2/12 (S3)"

  Scenario: Hitting a post split pair
    Given the hand label "12 (S1)"
    When hitting with next card "3"
    Then the next hand label is "15 (3+)"

  Scenario: Hitting a post split pair after aces
    Given the hand label "2/12 (A)"
    When hitting with next card "3"
    Then the next hand label is "5/15 (3+)"
