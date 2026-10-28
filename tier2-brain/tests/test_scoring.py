from app.scoring import total_score, score_cadence, score_payload, BLOCK_THRESHOLD

HUMAN_HEADERS = {"Accept-Language": "en-US"}


def test_human_scores_zero():
    assert total_score([0, 4.2, 9.9, 13.1, 20.5], HUMAN_HEADERS, "hello") == 0


def test_constant_cadence_blocked():
    assert score_cadence([0, 2.0, 4.01, 6.0, 8.0]) == 70
    assert total_score([0, 2.0, 4.0, 6.0, 8.0], HUMAN_HEADERS, "") >= BLOCK_THRESHOLD


def test_rce_payload():
    assert score_payload("; system(\"cat /etc/passwd\");") == 80
