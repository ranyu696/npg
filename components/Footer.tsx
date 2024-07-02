// components/Footer.tsx
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { BsForwardFill } from 'react-icons/bs';

interface FooterProps {
  links: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
        target: boolean;
      };
    }[];
  };
  email: string;
}

export default function Footer({ links, email }: FooterProps) {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-3">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {links.data.map((link: any) => (
          <Link
            key={link.id}
            isExternal
            className="flex items-center gap-1 text-current"
            href={link.attributes.url}
            target={link.attributes.target ? '_blank' : '_self'}
            title={link.attributes.name}
          >
            <Button
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
              color="primary"
              endContent={<BsForwardFill />}
              variant="shadow"
            >
              {link.attributes.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-6 mb-32 md:mb-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} 女仆阁视频网站. All rights
          reserved.邮箱:{email}
        </div>
      </div>
    </footer>
  );
}
