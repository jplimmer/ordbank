import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from './item';

type CommonProps = {
  title: string;
  description: string;
};

type FallbackItemProps =
  | (CommonProps & {
      linkButton: true;
      linkButtonHref: string;
      linkButtonText: string;
    })
  | (CommonProps & {
      linkButton: false;
    });

export function FallbackItem(props: FallbackItemProps) {
  return (
    <div className="grid justify-items-center items-start w-full h-full">
      <Item variant="outline" className="flex-col sm:flex-row">
        <ItemMedia
          variant="icon"
          className="!self-center sm:!self-start size-10 sm:size-8"
        >
          <ShieldAlert className="size-5 sm:size-4" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{props.title}</ItemTitle>
          <ItemDescription className="text-pretty">
            {props.description}
          </ItemDescription>
        </ItemContent>
        {props.linkButton && (
          <ItemActions className="w-full sm:w-auto">
            <Button
              size="default"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href={props.linkButtonHref}>{props.linkButtonText}</Link>
            </Button>
          </ItemActions>
        )}
      </Item>
    </div>
  );
}
