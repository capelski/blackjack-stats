Feature: Material hands

  The material hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Material hands for stand threshold
    When getting the material hands of a hand resolver with a stand threshold of 17
    Then 86099 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.00591715976331361" and action "hit"
    And the material hand 86099 has cards "K,K", score "20", probability "0.00591715976331361" and action "stand"
    And there is a material hand with cards "10,5", probability "0.00591715976331361" and action "hit"

  Scenario: Material hands for optimal actions
    When getting the material hands of a hand resolver for optimal actions
    Then 26923 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.00591715976331361" and action "hit"
    And the material hand 26923 has cards "K,K", score "20", probability "0.00591715976331361" and action "stand"
    And there is a material hand with cards "10,5", probability "0.00591715976331361" and action "stand"

  Scenario: Material hands for optimal actions with doubling
    Given doubling is allowed
    When getting the material hands of a hand resolver for optimal actions
    Then 25558 material hands are returned
    And there is a material hand with cards "5,6", probability "0.00591715976331361", action "double" and bet multiplier "2"
    And there is a material hand with cards "5,6,A", probability "0.0004551661356395085", action "end" and bet multiplier "2"

  Scenario: Material hands for optimal actions with splitting
    Given splitting is allowed
    When getting the material hands of a hand resolver for optimal actions
    Then 23660 material hands are returned
    And there is a material hand with cards "A,A", probability "0.00591715976331361", action "split" and bet multiplier "2"
    And there is a material post split hand with cards "A,A", probability "0.0004551661356395085", action "end" and bet multiplier "2"
    And there is a material hand with cards "8,8", probability "0.00591715976331361", action "split" and bet multiplier "2"
    And there is a material post split hand with cards "8,2", probability "0.0004551661356395085", action "hit" and bet multiplier "2"

  Scenario: Material hands for optimal actions with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the material hands of a hand resolver for optimal actions
    Then 30615 material hands are returned
    And there is a material post split hand with cards "A,A", probability "0.0004551661356395085", action "hit" and bet multiplier "2"

  Scenario: Material hands for optimal actions with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the material hands of a hand resolver for optimal actions
    Then 22295 material hands are returned

  Scenario: Material hands for optimal actions with doubling after splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the material hands of a hand resolver for optimal actions
    Then 22113 material hands are returned
    And there is a material post split hand with cards "8,2", probability "0.0004551661356395085", action "double" and bet multiplier "4"
    And there is a material post split hand with cards "8,2,6", probability "0.00003501277966457758", action "end" and bet multiplier "4"

  Scenario: Material hands for optimal actions with blackjack after split
    Given splitting is allowed
    And blackjack after split is allowed
    When getting the material hands of a hand resolver for optimal actions
    Then 23660 material hands are returned
    And there is a material post split hand with cards "A,J", probability "0.0004551661356395085", action "end" and bet multiplier "3"
