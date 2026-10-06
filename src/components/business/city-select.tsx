"use client";

import * as Select from "@radix-ui/react-select";
import styles from "./city-select.module.css";

interface CitySelectProps {
  initialValue: string;
  options: string[];
  onValueChange: (value: string) => void;
}

export function CitySelect({
  initialValue,
  options,
  onValueChange,
}: CitySelectProps) {
  return (
    <Select.Root
      name="city"
      defaultValue={initialValue || undefined}
      onValueChange={onValueChange}
    >
      <Select.Trigger
        id="business-city"
        className={styles.trigger}
        aria-required="true"
      >
        <Select.Value placeholder="Selecciona tu ciudad" />

        <Select.Icon className={styles.icon} aria-hidden="true">
          <span className={styles.chevron} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={styles.content}
          position="popper"
          sideOffset={8}
          align="start"
          collisionPadding={16}
        >
          <Select.Viewport className={styles.viewport}>
            {options.map((city) => (
              <Select.Item
                key={city}
                value={city}
                className={styles.item}
              >
                <Select.ItemText>{city}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}