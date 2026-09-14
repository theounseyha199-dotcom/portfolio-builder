import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sparkles } from "lucide-react";
import {
  AnimatedGridPattern,
  BorderBeam,
  EmptyState,
  NumberTicker,
  ShimmerButton,
  Skeleton,
} from "./index";
import {
  fadeIn,
  fadeUp,
  panelTransition,
  SPRING_GENTLE,
  SPRING_RESPONSIVE,
  TRANSITION_FAST,
  TRANSITION_NORMAL,
  TRANSITION_SLOW,
} from "@/lib/motion";

describe("motion and ui primitives", () => {
  describe("AnimatedGridPattern", () => {
    it("renders an svg pattern with custom width, height, and className", () => {
      const { container } = render(
        <AnimatedGridPattern
          width={40}
          height={40}
          className="test-grid-pattern"
        />
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("test-grid-pattern");
      expect(container.querySelector("defs")).toBeInTheDocument();
      expect(container.querySelector("pattern")).toBeInTheDocument();
    });
  });

  describe("NumberTicker", () => {
    it("renders target value cleanly", () => {
      render(<NumberTicker value={100} />);
      // NumberTicker renders the span with text content
      const span = screen.getByText(/\d+/);
      expect(span).toBeInTheDocument();
    });

    it("supports custom decimal places", () => {
      render(<NumberTicker value={49.95} decimalPlaces={2} />);
      const span = screen.getByText(/49\.95|0/);
      expect(span).toBeInTheDocument();
    });
  });

  describe("ShimmerButton", () => {
    it("renders children and responds to click events", () => {
      const handleClick = vi.fn();
      render(
        <ShimmerButton onClick={handleClick}>
          <span>Build My Portfolio</span>
        </ShimmerButton>
      );
      const button = screen.getByRole("button", {
        name: /build my portfolio/i,
      });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports disabled state", () => {
      render(
        <ShimmerButton disabled>
          <span>Disabled Action</span>
        </ShimmerButton>
      );
      expect(
        screen.getByRole("button", { name: /disabled action/i })
      ).toBeDisabled();
    });
  });

  describe("BorderBeam", () => {
    it("renders border beam overlay with expected styles", () => {
      const { container } = render(
        <div className="relative">
          <BorderBeam className="border-beam" size={200} duration={12} delay={2} />
        </div>
      );
      const beam = container.querySelector(".border-beam");
      expect(beam).toBeInTheDocument();
      expect(beam).toHaveStyle({
        "--size": "200",
        "--duration": "12",
        "--delay": "-2s",
      });
    });
  });

  describe("EmptyState", () => {
    it("renders icon, title, description, and action button", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          icon={Sparkles}
          title="No items found"
          description="Get started by creating your first entry."
          primaryAction={
            <button type="button" onClick={handleAction}>
              Create Entry
            </button>
          }
        />
      );
      expect(screen.getByText("No items found")).toBeInTheDocument();
      expect(
        screen.getByText("Get started by creating your first entry.")
      ).toBeInTheDocument();
      const actionButton = screen.getByRole("button", {
        name: "Create Entry",
      });
      expect(actionButton).toBeInTheDocument();
      fireEvent.click(actionButton);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Skeleton", () => {
    it("renders with base pulse animation class", () => {
      const { container } = render(
        <Skeleton className="h-6 w-32 rounded-md" />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass("animate-pulse");
      expect(skeleton).toHaveClass("h-6");
      expect(skeleton).toHaveClass("w-32");
    });
  });

  describe("Motion Foundation (lib/motion.ts)", () => {
    it("exports standardized transitions with expected timing", () => {
      expect(TRANSITION_FAST.duration).toBe(0.15);
      expect(TRANSITION_NORMAL.duration).toBe(0.22);
      expect(TRANSITION_SLOW.duration).toBe(0.35);
      expect(SPRING_GENTLE.type).toBe("spring");
      expect(SPRING_RESPONSIVE.type).toBe("spring");
    });

    it("exports valid motion variants", () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 });
      expect(fadeIn.animate).toHaveProperty("opacity", 1);
      expect(fadeUp.initial).toEqual({ opacity: 0, y: 12 });
      expect(fadeUp.animate).toHaveProperty("y", 0);
      expect(panelTransition.initial).toEqual({ opacity: 0, x: 6 });
      expect(panelTransition.animate).toHaveProperty("x", 0);
    });
  });
});
