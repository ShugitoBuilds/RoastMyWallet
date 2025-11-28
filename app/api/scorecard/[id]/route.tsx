import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Scorecard data interface (simplified for URL params)
interface ScorecardParams {
  grade: string;
  gradeColor: string;
  wallet: string;
  bagholder: string;
  timeBroke: string;
  tokenCount: string;
  roastType: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;

  // Get scorecard data from URL params
  const grade = searchParams.get("grade") || "F-";
  const gradeColor = searchParams.get("gradeColor") || "#991b1b";
  const wallet = searchParams.get("wallet") || "0x...";
  const bagholder = searchParams.get("bagholder") || "HOPIUM";
  const timeBroke = searchParams.get("timeBroke") || "Soon™";
  const tokenCount = searchParams.get("tokenCount") || "0";
  const roastType = searchParams.get("roastType") || "free";
  const hook = searchParams.get("hook");

  const isPremium = roastType === "premium";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(ellipse at top, rgba(249, 115, 22, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(220, 38, 38, 0.1) 0%, transparent 50%)",
          fontFamily: "system-ui, sans-serif",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Flame icon */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z"
              fill="#f97316"
            />
            <path
              d="M8 10C8 6 12 2 12 2C6 4 4 8 4 12C4 16 7 20 12 22C17 20 20 16 20 12C20 8 18 4 12 2C12 2 16 6 16 10C16 12 15 14 12 14C9 14 8 12 8 10Z"
              fill="#dc2626"
            />
          </svg>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Roast My Wallet
          </span>
          {isPremium && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#fbbf24",
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                padding: "4px 12px",
                borderRadius: "9999px",
                border: "1px solid rgba(251, 191, 36, 0.3)",
              }}
            >
              PREMIUM
            </span>
          )}
        </div>

        {/* Viral Hook (or fallback title) */}
        <div
          style={{
            fontSize: hook ? "32px" : "20px",
            fontWeight: hook ? "bold" : "normal",
            color: hook ? "#e4e4e7" : "#71717a",
            marginBottom: "30px",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.4,
            textTransform: hook ? "none" : "uppercase",
            letterSpacing: hook ? "normal" : "4px",
          }}
        >
          {hook || "Certificate of Portfolio Failure"}
        </div>

        {/* Main Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(24, 24, 27, 0.8)",
            border: "1px solid rgba(63, 63, 70, 0.5)",
            borderRadius: "24px",
            padding: "40px 60px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {/* Grade Circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "140px",
              height: "140px",
              borderRadius: "9999px",
              border: `4px solid ${gradeColor}`,
              backgroundColor: `${gradeColor}20`,
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: gradeColor,
              }}
            >
              {grade}
            </span>
          </div>

          {/* Wallet Address */}
          <div
            style={{
              fontSize: "16px",
              color: "#71717a",
              marginBottom: "30px",
              fontFamily: "monospace",
            }}
          >
            {wallet}
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {/* Top Bagholder */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "rgba(39, 39, 42, 0.5)",
                borderRadius: "16px",
                minWidth: "180px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Top Bagholder
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ef4444",
                }}
              >
                {bagholder}
              </span>
            </div>

            {/* Time Until Broke */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "rgba(39, 39, 42, 0.5)",
                borderRadius: "16px",
                minWidth: "180px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Time Until Broke
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#f97316",
                }}
              >
                {timeBroke}
              </span>
            </div>

            {/* Token Count */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "rgba(39, 39, 42, 0.5)",
                borderRadius: "16px",
                minWidth: "180px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Tokens Held
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#a1a1aa",
                }}
              >
                {tokenCount}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "30px",
            fontSize: "14px",
            color: "#52525b",
          }}
        >
          <span>Get roasted at</span>
          <span
            style={{
              color: "#f97316",
              fontWeight: "600",
            }}
          >
            roastmywallet.xyz
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}



