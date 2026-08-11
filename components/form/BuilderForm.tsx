"use client";

interface BuilderFormProps {
  name: string;
  role: string;
  team: string;
  onNameChange: (name: string) => void;
  onRoleChange: (role: string) => void;
  onTeamChange: (team: string) => void;
}

export function BuilderForm({
  name,
  role,
  team,
  onNameChange,
  onRoleChange,
  onTeamChange,
}: BuilderFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-mono text-xs tracking-widest text-[#B7FF00] uppercase font-bold">
        // BUILD YOUR HH GOA CARD
      </h2>

      {/* Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="builder-name"
          className="block font-mono text-xs tracking-widest text-[#475569] uppercase"
        >
          Name
        </label>
        <input
          id="builder-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={40}
          placeholder="Enter your name"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          className={[
            "w-full bg-[#0F1519] border rounded-xl px-4 py-3.5",
            "font-mono text-base font-bold tracking-wider uppercase",
            "text-white placeholder:text-[#1E2D3A] placeholder:normal-case placeholder:font-normal",
            "outline-none transition-all duration-200",
            "border-[#1E2D3A] focus:border-[#B7FF00] focus:shadow-[0_0_0_3px_rgba(183,255,0,0.08)]",
          ].join(" ")}
          style={{ fontSize: "16px", touchAction: "manipulation" }}
        />
        <div className="flex justify-end">
          <span className="font-mono text-[10px] text-[#475569] tabular-nums">
            {name.length}/40
          </span>
        </div>
      </div>

      {/* Role / Stack Input */}
      <div className="space-y-2">
        <label
          htmlFor="builder-role"
          className="block font-mono text-xs tracking-widest text-[#475569] uppercase"
        >
          Role / Stack
        </label>
        <input
          id="builder-role"
          type="text"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          maxLength={30}
          placeholder="AI × Full Stack"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          className={[
            "w-full bg-[#0F1519] border rounded-xl px-4 py-3.5",
            "font-mono text-base font-bold tracking-wider uppercase",
            "text-white placeholder:text-[#1E2D3A] placeholder:normal-case placeholder:font-normal",
            "outline-none transition-all duration-200",
            "border-[#1E2D3A] focus:border-[#B7FF00] focus:shadow-[0_0_0_3px_rgba(183,255,0,0.08)]",
          ].join(" ")}
          style={{ fontSize: "16px", touchAction: "manipulation" }}
        />
        <div className="flex justify-end">
          <span className="font-mono text-[10px] text-[#475569] tabular-nums">
            {role.length}/30
          </span>
        </div>
      </div>

      {/* Team Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="builder-team"
          className="block font-mono text-xs tracking-widest text-[#475569] uppercase"
        >
          Team Name
        </label>
        <input
          id="builder-team"
          type="text"
          value={team}
          onChange={(e) => onTeamChange(e.target.value)}
          maxLength={30}
          placeholder="Enter team name"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          className={[
            "w-full bg-[#0F1519] border rounded-xl px-4 py-3.5",
            "font-mono text-base font-bold tracking-wider uppercase",
            "text-white placeholder:text-[#1E2D3A] placeholder:normal-case placeholder:font-normal",
            "outline-none transition-all duration-200",
            "border-[#1E2D3A] focus:border-[#B7FF00] focus:shadow-[0_0_0_3px_rgba(183,255,0,0.08)]",
          ].join(" ")}
          style={{ fontSize: "16px", touchAction: "manipulation" }}
        />
        <div className="flex justify-end">
          <span className="font-mono text-[10px] text-[#475569] tabular-nums">
            {team.length}/30
          </span>
        </div>
      </div>
    </div>
  );
}
