Feature: Abstract hands

  Every material hand is represented by an abstract hand with the corresponding properties

  Scenario: Abstract hands
    When getting the abstract hands
    Then 208 abstract hands are returned
    And there are 26 abstract hands with category "3+ cards"
    And there are 26 abstract hands with category "Post double hand"
    And there are 27 abstract hands with category "Initial pair"
    And there are 38 abstract hands with category "One split pair"
    And there are 11 abstract hands with category "One split pair (A)"
    And there are 40 abstract hands with category "Two splits pair"
    And there are 27 abstract hands with category "Three splits pair"
    And there are 13 abstract hands with category "Splittable pair"

  Scenario: Abstract hands (blackjack after split)
    Given blackjack after split is allowed
    When getting the abstract hands
    Then there is an abstract hand with label "BJ (S1)"
    And there is an abstract hand with label "BJ (A)"
    And there is no abstract hand with label "11/21 (S1)"
    And there is no abstract hand with label "11/21 (A)"

  Scenario: Abstract hands (NO blackjack after split)
    When getting the abstract hands
    Then there is an abstract hand with label "11/21 (S1)"
    And there is an abstract hand with label "11/21 (A)"
    And there is no abstract hand with label "BJ (S1)"
    And there is no abstract hand with label "BJ (A)"
