Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the hands by
  final score and hand modifiers and computes the final probabilities correctly

  Scenario: Final score probabilities (stand threshold)
    Given the final scores for a hand resolver with a stand threshold of 17
    When getting the final score "17"
    Then the final score probability is "0.14512590450523458"
    When getting the final score "BJ"
    Then the final score probability is "0.04733727810650889"

  Scenario: Final scores list (stand threshold)
    Given the final scores for a hand resolver with a stand threshold of 17
    Then the final scores list contains 7 elements
    And the final score 1 has id "17", score "17", probability "0.14512590450523458" and "6640" hands
    And the final score 6 has id "21.5", score "BJ", probability "0.04733727810650889" and "8" hands
    And the final score 7 has id "22", score "22+", probability "0.2815928473666239" and "46098" hands

  Scenario: Final scores by first card (stand threshold)
    Given the final scores by first card of a hand resolver with a stand threshold of 17
    Then the final scores map contains 10 elements
    And the final scores group "6" has an accumulated probability of "0.07692307692307622"
    And the final score "17" of the final scores group "6" has probability "0.16543817650334763" and "259" hands
    And the final scores group "10-K" has an accumulated probability of "0.307692307692307"
    And the final score "17" of the final scores group "10-K" has probability "0.11142433852261416" and "128" hands
    And the final score "BJ" of the final scores group "10-K" has probability "0.07692307692307711" and "4" hands
    And the final score "22+" of the final scores group "10-K" has probability "0.21210907661769818" and "888" hands

  Scenario: Final scores list (optimal actions)
    Given the final scores for an optimal actions hand resolver
    Then the final scores list contains 9 elements
    And the final score 1 has id "15", score "15", probability "0.12627279484635673" and "2104" hands
    And the final score 9 has id "22", score "22+", probability "0.1375096477714669" and "9882" hands

  Scenario: Final scores list (optimal actions, doubling)
    Given doubling is allowed
    And the final scores for an optimal actions hand resolver
    Then the final scores list contains 19 elements
    And the final score 8 has id "17", score "17", probability "0.10503004947229833" and "2080" hands
    And the final score 9 has id "17-double", score "17", probability "0.006827492034592626" and "15" hands

  Scenario: Final scores list (optimal actions, splitting)
    Given splitting is allowed
    And the final scores for an optimal actions hand resolver
    Then the final scores list contains 20 elements
    And the final score 19 has id "22", score "22+", probability "0.13648913871486373" and "8557" hands
    And the final score 20 has id "22-split", score "22+", probability "0.0013205092958611243" and "228" hands

  Scenario: Final scores list (optimal actions, hit split aces)
    Given splitting is allowed
    And hitting split aces is allowed
    And the final scores for an optimal actions hand resolver
    Then the final scores list contains 17 elements
    And the final score 16 has id "22", score "22+", probability "0.13648913871486373" and "8557" hands
    And the final score 17 has id "22-split", score "22+", probability "0.002151165809572886" and "5360" hands

  Scenario: Final scores list (optimal actions, blackjack after split)
    Given splitting is allowed
    And blackjack after split is allowed
    And the final scores for an optimal actions hand resolver
    Then the final scores list contains 21 elements
    And the final score 17 has id "21-split", score "21", probability "0.0006116479214958979" and "52" hands
    And the final score 18 has id "21.5-split", score "BJ", probability "0.0036413290851160683" and "8" hands

  Scenario: Final scores list (optimal actions, doubling and splitting)
    Given doubling is allowed
    And splitting is allowed
    And the final scores for an optimal actions hand resolver
    Then the final scores list contains 30 elements
    And the final score 7 has id "15", score "15", probability "0.11726420780597892" and "1700" hands
    And the final score 8 has id "15-split", score "15", probability "0.002222235786066467" and "50" hands
    And the final score 9 has id "15-double", score "15", probability "0.006827492034592626" and "15" hands

  Scenario: Final scores list (optimal actions, doubling after splitting)
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    And the final scores for an optimal actions hand resolver
    Then the final scores list contains 40 elements
    And the final score 10 has id "15", score "15", probability "0.11726420780597892" and "1700" hands
    And the final score 11 has id "15-split", score "15", probability "0.00204731531742814" and "18" hands
    And the final score 12 has id "15-double", score "15", probability "0.006827492034592626" and "15" hands
    And the final score 13 has id "15-split-double", score "15", probability "0.00014005111865831031" and "4" hands

  Scenario: Final scores list (optimal actions, surrendering)
    Given surrendering is allowed
    And the final scores for an optimal actions hand resolver that surrenders "16" hands
    Then the final scores list contains 10 elements
    And the final score 1 has id "0", score "Surrender", probability "0.06508875739644972" and "11" hands
