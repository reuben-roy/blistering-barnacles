import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, Td, Th } from "@/components/ui/Table";

export default function AccountSecurityPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Account and Security"
        description="Demo layout only. No authentication or security guarantees."
      />

      <Card>
        <div className="text-sm font-semibold">Password</div>
        <p className="mt-2 text-sm text-muted">Last changed 92 days ago (fixture).</p>
        <Button className="mt-3" variant="secondary" disabled>
          Change password (demo)
        </Button>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Two-factor authentication</div>
        <p className="mt-2 text-sm text-muted">Authenticator app recommended for teams.</p>
        <Button className="mt-3" variant="secondary" disabled>
          Enable 2FA (demo)
        </Button>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Active sessions</div>
        <Table>
          <thead>
            <tr>
              <Th>Device</Th>
              <Th>Location</Th>
              <Th>Last seen</Th>
            </tr>
          </thead>
          <tbody>
            <TrRow device="Chrome on macOS" location="Phoenix, AZ" last="Now" />
            <TrRow device="Mobile Safari" location="Scottsdale, AZ" last="Yesterday" />
            <TrRow device="Edge on Windows" location="Tempe, AZ" last="4 days ago" />
          </tbody>
        </Table>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Login history</div>
        <div className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>IP</Th>
                <Th>Result</Th>
              </tr>
            </thead>
            <tbody>
              <TrLogin when="Today, 8:12 AM" ip="10.0.0.12" result="Success" />
              <TrLogin when="Yesterday, 6:40 PM" ip="10.0.0.55" result="Success" />
              <TrLogin when="Mon, 9:05 AM" ip="198.51.100.10" result="Blocked (demo)" />
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function TrRow({ device, location, last }: { device: string; location: string; last: string }) {
  return (
    <tr>
      <Td>{device}</Td>
      <Td>{location}</Td>
      <Td>{last}</Td>
    </tr>
  );
}

function TrLogin({ when, ip, result }: { when: string; ip: string; result: string }) {
  return (
    <tr>
      <Td>{when}</Td>
      <Td className="font-mono text-xs">{ip}</Td>
      <Td>{result}</Td>
    </tr>
  );
}
